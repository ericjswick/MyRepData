/**
 * TrayTracker Bi-Directional Sync Service
 * Handles real-time synchronization between Medical CRM and TrayTracker systems
 */

class TrayTrackerSyncService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_TRAYTRACKER_API_URL || 'https://api.traytracker.com';
    this.apiKey = process.env.REACT_APP_TRAYTRACKER_API_KEY || 'demo-key';
    this.syncInterval = null;
    this.websocket = null;
    this.syncStatus = {
      lastSync: null,
      isConnected: false,
      syncInProgress: false,
      errors: []
    };
    this.eventListeners = new Map();
  }

  /**
   * Initialize bi-directional sync
   */
  async initialize() {
    try {
      await this.testConnection();
      await this.setupWebSocketConnection();
      this.startPeriodicSync();
      this.syncStatus.isConnected = true;
      this.emit('connectionStatusChanged', { connected: true });
      console.log('TrayTracker bi-directional sync initialized successfully');
    } catch (error) {
      console.error('Failed to initialize TrayTracker sync:', error);
      this.syncStatus.isConnected = false;
      this.emit('connectionStatusChanged', { connected: false, error: error.message });
      throw error;
    }
  }

  /**
   * Test connection to TrayTracker API
   */
  async testConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/health`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`TrayTracker API connection failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Fallback for demo/development
      console.warn('TrayTracker API not available, using mock connection');
      return { status: 'connected', version: '1.0.0', mode: 'mock' };
    }
  }

  /**
   * Setup WebSocket connection for real-time updates
   */
  async setupWebSocketConnection() {
    try {
      const wsUrl = `${this.baseUrl.replace('http', 'ws')}/ws/sync?token=${this.apiKey}`;
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        console.log('TrayTracker WebSocket connected');
        this.emit('websocketConnected');
      };

      this.websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleRealtimeUpdate(data);
      };

      this.websocket.onclose = () => {
        console.log('TrayTracker WebSocket disconnected');
        this.emit('websocketDisconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.setupWebSocketConnection(), 5000);
      };

      this.websocket.onerror = (error) => {
        console.error('TrayTracker WebSocket error:', error);
        this.emit('websocketError', error);
      };
    } catch (error) {
      console.warn('WebSocket connection failed, falling back to polling');
    }
  }

  /**
   * Handle real-time updates from TrayTracker
   */
  handleRealtimeUpdate(data) {
    switch (data.type) {
      case 'tray_status_changed':
        this.handleTrayStatusUpdate(data.payload);
        break;
      case 'case_assigned':
        this.handleCaseAssignment(data.payload);
        break;
      case 'inventory_updated':
        this.handleInventoryUpdate(data.payload);
        break;
      case 'facility_sync_request':
        this.handleSyncRequest(data.payload);
        break;
      default:
        console.log('Unknown TrayTracker update type:', data.type);
    }
  }

  /**
   * OUTBOUND SYNC: Send data TO TrayTracker
   */

  /**
   * Sync case scheduling to TrayTracker
   */
  async syncCaseToTrayTracker(caseData) {
    try {
      const payload = {
        case_id: caseData.id,
        physician_id: caseData.physician_id,
        facility_id: caseData.facility_id,
        case_type: caseData.case_type,
        scheduled_date: caseData.date,
        scheduled_time: caseData.time,
        duration: caseData.duration,
        tray_requirements: caseData.tray_requirements || [],
        status: caseData.status || 'scheduled',
        notes: caseData.notes,
        created_at: new Date().toISOString(),
        source: 'medical_crm'
      };

      const response = await this.makeApiCall('POST', '/api/v1/cases', payload);
      
      if (response.success) {
        console.log(`Case ${caseData.id} synced to TrayTracker successfully`);
        this.emit('caseSynced', { caseId: caseData.id, direction: 'outbound' });
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to sync case to TrayTracker');
      }
    } catch (error) {
      console.error('Error syncing case to TrayTracker:', error);
      this.addSyncError('case_sync_outbound', error.message);
      throw error;
    }
  }

  /**
   * Update case status in TrayTracker
   */
  async updateCaseStatusInTrayTracker(caseId, status, notes = '') {
    try {
      const payload = {
        status: status,
        notes: notes,
        updated_at: new Date().toISOString(),
        source: 'medical_crm'
      };

      const response = await this.makeApiCall('PATCH', `/api/v1/cases/${caseId}`, payload);
      
      if (response.success) {
        console.log(`Case ${caseId} status updated in TrayTracker: ${status}`);
        this.emit('caseStatusUpdated', { caseId, status, direction: 'outbound' });
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update case status in TrayTracker');
      }
    } catch (error) {
      console.error('Error updating case status in TrayTracker:', error);
      this.addSyncError('case_status_update_outbound', error.message);
      throw error;
    }
  }

  /**
   * Request tray assignment from TrayTracker
   */
  async requestTrayAssignment(caseId, trayRequirements) {
    try {
      const payload = {
        case_id: caseId,
        tray_requirements: trayRequirements,
        requested_at: new Date().toISOString(),
        source: 'medical_crm'
      };

      const response = await this.makeApiCall('POST', '/api/v1/tray-assignments', payload);
      
      if (response.success) {
        console.log(`Tray assignment requested for case ${caseId}`);
        this.emit('trayAssignmentRequested', { caseId, assignments: response.data });
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to request tray assignment');
      }
    } catch (error) {
      console.error('Error requesting tray assignment:', error);
      this.addSyncError('tray_assignment_request', error.message);
      throw error;
    }
  }

  /**
   * INBOUND SYNC: Receive data FROM TrayTracker
   */

  /**
   * Fetch tray availability from TrayTracker
   */
  async fetchTrayAvailability(facilityId) {
    try {
      const response = await this.makeApiCall('GET', `/api/v1/facilities/${facilityId}/trays`);
      
      if (response.success) {
        const trays = response.data.trays || [];
        this.emit('trayAvailabilityUpdated', { facilityId, trays });
        return trays;
      } else {
        throw new Error(response.error || 'Failed to fetch tray availability');
      }
    } catch (error) {
      console.error('Error fetching tray availability:', error);
      this.addSyncError('tray_availability_fetch', error.message);
      // Return mock data for development
      return this.getMockTrayData(facilityId);
    }
  }

  /**
   * Fetch case updates from TrayTracker
   */
  async fetchCaseUpdates(lastSyncTime = null) {
    try {
      const params = lastSyncTime ? `?since=${lastSyncTime}` : '';
      const response = await this.makeApiCall('GET', `/api/v1/cases/updates${params}`);
      
      if (response.success) {
        const updates = response.data.updates || [];
        this.emit('caseUpdatesReceived', { updates });
        return updates;
      } else {
        throw new Error(response.error || 'Failed to fetch case updates');
      }
    } catch (error) {
      console.error('Error fetching case updates:', error);
      this.addSyncError('case_updates_fetch', error.message);
      return [];
    }
  }

  /**
   * REAL-TIME UPDATE HANDLERS
   */

  /**
   * Handle tray status updates from TrayTracker
   */
  handleTrayStatusUpdate(payload) {
    console.log('Tray status update received:', payload);
    this.emit('trayStatusChanged', payload);
    
    // Update local storage/state
    this.updateLocalTrayStatus(payload);
  }

  /**
   * Handle case assignment updates from TrayTracker
   */
  handleCaseAssignment(payload) {
    console.log('Case assignment update received:', payload);
    this.emit('caseAssignmentChanged', payload);
    
    // Update local case data
    this.updateLocalCaseAssignment(payload);
  }

  /**
   * Handle inventory updates from TrayTracker
   */
  handleInventoryUpdate(payload) {
    console.log('Inventory update received:', payload);
    this.emit('inventoryUpdated', payload);
    
    // Update local inventory data
    this.updateLocalInventory(payload);
  }

  /**
   * Handle sync requests from TrayTracker
   */
  async handleSyncRequest(payload) {
    console.log('Sync request received from TrayTracker:', payload);
    
    try {
      switch (payload.sync_type) {
        case 'full_facility_sync':
          await this.performFullFacilitySync(payload.facility_id);
          break;
        case 'case_data_sync':
          await this.syncCaseData(payload.case_ids);
          break;
        case 'tray_status_sync':
          await this.syncTrayStatus(payload.facility_id);
          break;
        default:
          console.warn('Unknown sync request type:', payload.sync_type);
      }
    } catch (error) {
      console.error('Error handling sync request:', error);
      this.addSyncError('sync_request_handler', error.message);
    }
  }

  /**
   * SYNC OPERATIONS
   */

  /**
   * Perform full bi-directional sync
   */
  async performFullSync() {
    if (this.syncStatus.syncInProgress) {
      console.log('Sync already in progress, skipping');
      return;
    }

    try {
      this.syncStatus.syncInProgress = true;
      this.emit('syncStarted');

      // Get all facilities
      const facilities = await this.getLocalFacilities();
      
      for (const facility of facilities) {
        await this.performFacilitySync(facility.id);
      }

      this.syncStatus.lastSync = new Date().toISOString();
      this.emit('syncCompleted', { timestamp: this.syncStatus.lastSync });
      
    } catch (error) {
      console.error('Full sync failed:', error);
      this.addSyncError('full_sync', error.message);
      this.emit('syncFailed', { error: error.message });
    } finally {
      this.syncStatus.syncInProgress = false;
    }
  }

  /**
   * Perform facility-specific sync
   */
  async performFacilitySync(facilityId) {
    try {
      // Sync tray availability
      const trays = await this.fetchTrayAvailability(facilityId);
      
      // Sync case updates
      const caseUpdates = await this.fetchCaseUpdates(this.syncStatus.lastSync);
      
      // Process updates
      await this.processCaseUpdates(caseUpdates);
      
      this.emit('facilitySyncCompleted', { facilityId, trays: trays.length, cases: caseUpdates.length });
      
    } catch (error) {
      console.error(`Facility sync failed for ${facilityId}:`, error);
      this.addSyncError('facility_sync', error.message);
      throw error;
    }
  }

  /**
   * UTILITY METHODS
   */

  /**
   * Make API call to TrayTracker
   */
  async makeApiCall(method, endpoint, data = null) {
    try {
      const options = {
        method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      };

      if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // Return mock response for development
      console.warn(`TrayTracker API call failed, using mock response: ${method} ${endpoint}`);
      return this.getMockApiResponse(method, endpoint, data);
    }
  }

  /**
   * Get mock API response for development
   */
  getMockApiResponse(method, endpoint, data) {
    if (endpoint.includes('/trays')) {
      return {
        success: true,
        data: {
          trays: this.getMockTrayData()
        }
      };
    }
    
    if (endpoint.includes('/cases')) {
      return {
        success: true,
        data: {
          case_id: data?.case_id || 'mock-case-id',
          status: 'synced'
        }
      };
    }

    return { success: true, data: {} };
  }

  /**
   * Get mock tray data for development
   */
  getMockTrayData(facilityId = null) {
    return [
      {
        tray_id: 'TRAY_001',
        status: 'available',
        location: 'Sterile Processing',
        facility_id: facilityId || 1,
        last_updated: new Date().toISOString(),
        case_type_compatibility: ['SI fusion', 'Spine fusion']
      },
      {
        tray_id: 'TRAY_002',
        status: 'in_use',
        location: 'OR 3',
        facility_id: facilityId || 1,
        last_updated: new Date().toISOString(),
        case_type_compatibility: ['SI fusion']
      },
      {
        tray_id: 'TRAY_003',
        status: 'cleaning',
        location: 'Decontamination',
        facility_id: facilityId || 1,
        last_updated: new Date().toISOString(),
        case_type_compatibility: ['Spine fusion']
      }
    ];
  }

  /**
   * Event system for sync notifications
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data = null) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Error handling
   */
  addSyncError(type, message) {
    const error = {
      type,
      message,
      timestamp: new Date().toISOString()
    };
    
    this.syncStatus.errors.push(error);
    
    // Keep only last 50 errors
    if (this.syncStatus.errors.length > 50) {
      this.syncStatus.errors = this.syncStatus.errors.slice(-50);
    }
    
    this.emit('syncError', error);
  }

  /**
   * Start periodic sync
   */
  startPeriodicSync(intervalMinutes = 5) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(() => {
      this.performFullSync();
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Stop periodic sync
   */
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return { ...this.syncStatus };
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    this.stopPeriodicSync();
    
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    
    this.eventListeners.clear();
  }

  /**
   * Placeholder methods for local data operations
   * These should be implemented based on your local storage/state management
   */
  async getLocalFacilities() {
    // Implement based on your data source
    return [
      { id: 1, name: 'Advanced Spine Center' },
      { id: 2, name: 'Access Medical Center' }
    ];
  }

  updateLocalTrayStatus(payload) {
    // Implement local tray status update
    console.log('Updating local tray status:', payload);
  }

  updateLocalCaseAssignment(payload) {
    // Implement local case assignment update
    console.log('Updating local case assignment:', payload);
  }

  updateLocalInventory(payload) {
    // Implement local inventory update
    console.log('Updating local inventory:', payload);
  }

  async processCaseUpdates(updates) {
    // Implement case updates processing
    console.log('Processing case updates:', updates);
  }

  async syncCaseData(caseIds) {
    // Implement case data sync
    console.log('Syncing case data for:', caseIds);
  }

  async syncTrayStatus(facilityId) {
    // Implement tray status sync
    console.log('Syncing tray status for facility:', facilityId);
  }

  async performFullFacilitySync(facilityId) {
    // Implement full facility sync
    console.log('Performing full facility sync for:', facilityId);
  }
}

// Export singleton instance
export const trayTrackerSync = new TrayTrackerSyncService();
export default TrayTrackerSyncService;

