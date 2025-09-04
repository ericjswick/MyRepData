import { useState, useEffect, useCallback, useRef } from 'react';
import { trayTrackerSync } from '../services/trayTrackerSync.js';

/**
 * React hook for TrayTracker bi-directional sync integration
 * Provides easy access to sync functionality across components
 */
export const useTrayTrackerSync = (options = {}) => {
  const {
    autoInitialize = true,
    enableRealtime = true,
    syncInterval = 5, // minutes
    onSyncComplete = null,
    onSyncError = null,
    onTrayUpdate = null,
    onCaseUpdate = null
  } = options;

  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [errors, setErrors] = useState([]);
  const [realtimeUpdates, setRealtimeUpdates] = useState([]);

  // Refs for cleanup
  const eventListenersRef = useRef(new Map());
  const isInitializingRef = useRef(false);

  // Event handlers
  const handleConnectionStatusChange = useCallback((data) => {
    setIsConnected(data.connected);
    setConnectionStatus(data.connected ? 'connected' : 'disconnected');
  }, []);

  const handleSyncStarted = useCallback(() => {
    setSyncInProgress(true);
  }, []);

  const handleSyncCompleted = useCallback((data) => {
    setSyncInProgress(false);
    setLastSync(data.timestamp);
    onSyncComplete?.(data);
  }, [onSyncComplete]);

  const handleSyncFailed = useCallback((data) => {
    setSyncInProgress(false);
    const error = { ...data, timestamp: new Date().toISOString() };
    setErrors(prev => [error, ...prev.slice(0, 49)]);
    onSyncError?.(error);
  }, [onSyncError]);

  const handleTrayStatusChanged = useCallback((data) => {
    const update = {
      id: Date.now(),
      type: 'tray_status',
      data,
      timestamp: new Date().toISOString()
    };
    setRealtimeUpdates(prev => [update, ...prev.slice(0, 99)]);
    onTrayUpdate?.(data);
  }, [onTrayUpdate]);

  const handleCaseAssignmentChanged = useCallback((data) => {
    const update = {
      id: Date.now(),
      type: 'case_assignment',
      data,
      timestamp: new Date().toISOString()
    };
    setRealtimeUpdates(prev => [update, ...prev.slice(0, 99)]);
    onCaseUpdate?.(data);
  }, [onCaseUpdate]);

  const handleWebSocketConnected = useCallback(() => {
    setConnectionStatus('realtime');
  }, []);

  const handleWebSocketDisconnected = useCallback(() => {
    setConnectionStatus('connected');
  }, []);

  const handleSyncError = useCallback((error) => {
    setErrors(prev => [error, ...prev.slice(0, 49)]);
  }, []);

  // Initialize sync service
  const initialize = useCallback(async () => {
    if (isInitializingRef.current || isInitialized) {
      return;
    }

    try {
      isInitializingRef.current = true;

      // Set up event listeners
      const listeners = [
        ['connectionStatusChanged', handleConnectionStatusChange],
        ['syncStarted', handleSyncStarted],
        ['syncCompleted', handleSyncCompleted],
        ['syncFailed', handleSyncFailed],
        ['trayStatusChanged', handleTrayStatusChanged],
        ['caseAssignmentChanged', handleCaseAssignmentChanged],
        ['websocketConnected', handleWebSocketConnected],
        ['websocketDisconnected', handleWebSocketDisconnected],
        ['syncError', handleSyncError]
      ];

      listeners.forEach(([event, handler]) => {
        trayTrackerSync.on(event, handler);
        eventListenersRef.current.set(event, handler);
      });

      // Initialize the sync service
      await trayTrackerSync.initialize();
      
      // Set sync interval if different from default
      if (syncInterval !== 5) {
        trayTrackerSync.startPeriodicSync(syncInterval);
      }

      setIsInitialized(true);
      
    } catch (error) {
      console.error('Failed to initialize TrayTracker sync:', error);
      setErrors(prev => [{
        type: 'initialization',
        message: error.message,
        timestamp: new Date().toISOString()
      }, ...prev.slice(0, 49)]);
    } finally {
      isInitializingRef.current = false;
    }
  }, [
    isInitialized,
    syncInterval,
    handleConnectionStatusChange,
    handleSyncStarted,
    handleSyncCompleted,
    handleSyncFailed,
    handleTrayStatusChanged,
    handleCaseAssignmentChanged,
    handleWebSocketConnected,
    handleWebSocketDisconnected,
    handleSyncError
  ]);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Remove event listeners
    eventListenersRef.current.forEach((handler, event) => {
      trayTrackerSync.off(event, handler);
    });
    eventListenersRef.current.clear();

    // Reset state
    setIsInitialized(false);
    setIsConnected(false);
    setSyncInProgress(false);
    setConnectionStatus('disconnected');
  }, []);

  // Auto-initialize on mount
  useEffect(() => {
    if (autoInitialize && !isInitialized && !isInitializingRef.current) {
      initialize();
    }

    return cleanup;
  }, [autoInitialize, initialize, cleanup, isInitialized]);

  // Sync functions
  const performFullSync = useCallback(async () => {
    try {
      await trayTrackerSync.performFullSync();
    } catch (error) {
      console.error('Manual sync failed:', error);
      throw error;
    }
  }, []);

  const syncCaseToTrayTracker = useCallback(async (caseData) => {
    try {
      return await trayTrackerSync.syncCaseToTrayTracker(caseData);
    } catch (error) {
      console.error('Case sync failed:', error);
      throw error;
    }
  }, []);

  const updateCaseStatus = useCallback(async (caseId, status, notes = '') => {
    try {
      return await trayTrackerSync.updateCaseStatusInTrayTracker(caseId, status, notes);
    } catch (error) {
      console.error('Case status update failed:', error);
      throw error;
    }
  }, []);

  const requestTrayAssignment = useCallback(async (caseId, trayRequirements) => {
    try {
      return await trayTrackerSync.requestTrayAssignment(caseId, trayRequirements);
    } catch (error) {
      console.error('Tray assignment request failed:', error);
      throw error;
    }
  }, []);

  const fetchTrayAvailability = useCallback(async (facilityId) => {
    try {
      return await trayTrackerSync.fetchTrayAvailability(facilityId);
    } catch (error) {
      console.error('Tray availability fetch failed:', error);
      throw error;
    }
  }, []);

  const testConnection = useCallback(async () => {
    try {
      return await trayTrackerSync.testConnection();
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }, []);

  // Utility functions
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const clearRealtimeUpdates = useCallback(() => {
    setRealtimeUpdates([]);
  }, []);

  const getSyncStatus = useCallback(() => {
    return trayTrackerSync.getSyncStatus();
  }, []);

  // Return hook interface
  return {
    // State
    isConnected,
    isInitialized,
    syncInProgress,
    lastSync,
    connectionStatus,
    errors,
    realtimeUpdates,

    // Actions
    initialize,
    cleanup,
    performFullSync,
    syncCaseToTrayTracker,
    updateCaseStatus,
    requestTrayAssignment,
    fetchTrayAvailability,
    testConnection,

    // Utilities
    clearErrors,
    clearRealtimeUpdates,
    getSyncStatus,

    // Service instance (for advanced usage)
    syncService: trayTrackerSync
  };
};

/**
 * Hook for case-specific TrayTracker operations
 */
export const useTrayTrackerCase = (caseId, caseData = null) => {
  const sync = useTrayTrackerSync({
    autoInitialize: true,
    onTrayUpdate: (data) => {
      // Filter updates relevant to this case
      if (data.case_id === caseId) {
        console.log(`Tray update for case ${caseId}:`, data);
      }
    },
    onCaseUpdate: (data) => {
      // Filter updates relevant to this case
      if (data.case_id === caseId) {
        console.log(`Case update for case ${caseId}:`, data);
      }
    }
  });

  const [trayAssignments, setTrayAssignments] = useState([]);
  const [trayAvailability, setTrayAvailability] = useState([]);

  // Sync this specific case
  const syncCase = useCallback(async () => {
    if (!caseData) {
      throw new Error('Case data is required for sync');
    }
    return await sync.syncCaseToTrayTracker({ id: caseId, ...caseData });
  }, [caseId, caseData, sync]);

  // Update case status
  const updateStatus = useCallback(async (status, notes = '') => {
    return await sync.updateCaseStatus(caseId, status, notes);
  }, [caseId, sync]);

  // Request tray assignment
  const requestTrays = useCallback(async (trayRequirements) => {
    const result = await sync.requestTrayAssignment(caseId, trayRequirements);
    setTrayAssignments(result.assignments || []);
    return result;
  }, [caseId, sync]);

  // Fetch tray availability for case facility
  const fetchAvailability = useCallback(async (facilityId) => {
    const trays = await sync.fetchTrayAvailability(facilityId);
    setTrayAvailability(trays);
    return trays;
  }, [sync]);

  return {
    ...sync,
    caseId,
    trayAssignments,
    trayAvailability,
    syncCase,
    updateStatus,
    requestTrays,
    fetchAvailability
  };
};

/**
 * Hook for facility-specific TrayTracker operations
 */
export const useTrayTrackerFacility = (facilityId) => {
  const sync = useTrayTrackerSync({
    autoInitialize: true,
    onTrayUpdate: (data) => {
      // Filter updates relevant to this facility
      if (data.facility_id === facilityId) {
        console.log(`Tray update for facility ${facilityId}:`, data);
        setTrayStatus(prev => prev.map(tray => 
          tray.tray_id === data.tray_id ? { ...tray, ...data } : tray
        ));
      }
    }
  });

  const [trayStatus, setTrayStatus] = useState([]);
  const [facilityStats, setFacilityStats] = useState({
    totalTrays: 0,
    availableTrays: 0,
    inUseTrays: 0,
    cleaningTrays: 0
  });

  // Fetch tray status for this facility
  const fetchTrayStatus = useCallback(async () => {
    const trays = await sync.fetchTrayAvailability(facilityId);
    setTrayStatus(trays);
    
    // Calculate stats
    const stats = trays.reduce((acc, tray) => {
      acc.totalTrays++;
      switch (tray.status) {
        case 'available':
          acc.availableTrays++;
          break;
        case 'in_use':
          acc.inUseTrays++;
          break;
        case 'cleaning':
          acc.cleaningTrays++;
          break;
      }
      return acc;
    }, { totalTrays: 0, availableTrays: 0, inUseTrays: 0, cleaningTrays: 0 });
    
    setFacilityStats(stats);
    return trays;
  }, [facilityId, sync]);

  // Auto-fetch on facility change
  useEffect(() => {
    if (facilityId && sync.isInitialized) {
      fetchTrayStatus();
    }
  }, [facilityId, sync.isInitialized, fetchTrayStatus]);

  return {
    ...sync,
    facilityId,
    trayStatus,
    facilityStats,
    fetchTrayStatus
  };
};

export default useTrayTrackerSync;

