import React, { useState, useEffect, useCallback } from 'react';
import { 
  RefreshCw, 
  ArrowLeftRight, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock, 
  Wifi, 
  WifiOff,
  Settings,
  Activity,
  Database,
  Send,
  Download,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { trayTrackerSync } from '../services/trayTrackerSync.js';

const TrayTrackerBiDirectionalSync = () => {
  const [syncStatus, setSyncStatus] = useState({
    isConnected: false,
    lastSync: null,
    syncInProgress: false,
    errors: []
  });
  
  const [realtimeUpdates, setRealtimeUpdates] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncStats, setSyncStats] = useState({
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    lastSyncDuration: 0
  });
  
  const [activeTab, setActiveTab] = useState('overview');

  // Initialize sync service and event listeners
  useEffect(() => {
    const initializeSync = async () => {
      try {
        // Set up event listeners
        trayTrackerSync.on('connectionStatusChanged', handleConnectionStatusChange);
        trayTrackerSync.on('syncStarted', handleSyncStarted);
        trayTrackerSync.on('syncCompleted', handleSyncCompleted);
        trayTrackerSync.on('syncFailed', handleSyncFailed);
        trayTrackerSync.on('trayStatusChanged', handleTrayStatusUpdate);
        trayTrackerSync.on('caseAssignmentChanged', handleCaseAssignmentUpdate);
        trayTrackerSync.on('syncError', handleSyncError);
        trayTrackerSync.on('websocketConnected', handleWebSocketConnected);
        trayTrackerSync.on('websocketDisconnected', handleWebSocketDisconnected);

        // Initialize the sync service
        await trayTrackerSync.initialize();
        
        // Get initial status
        setSyncStatus(trayTrackerSync.getSyncStatus());
        
      } catch (error) {
        console.error('Failed to initialize TrayTracker sync:', error);
        setConnectionStatus('error');
      }
    };

    initializeSync();

    // Cleanup on unmount
    return () => {
      trayTrackerSync.off('connectionStatusChanged', handleConnectionStatusChange);
      trayTrackerSync.off('syncStarted', handleSyncStarted);
      trayTrackerSync.off('syncCompleted', handleSyncCompleted);
      trayTrackerSync.off('syncFailed', handleSyncFailed);
      trayTrackerSync.off('trayStatusChanged', handleTrayStatusUpdate);
      trayTrackerSync.off('caseAssignmentChanged', handleCaseAssignmentUpdate);
      trayTrackerSync.off('syncError', handleSyncError);
      trayTrackerSync.off('websocketConnected', handleWebSocketConnected);
      trayTrackerSync.off('websocketDisconnected', handleWebSocketDisconnected);
    };
  }, []);

  // Event handlers
  const handleConnectionStatusChange = useCallback((data) => {
    setConnectionStatus(data.connected ? 'connected' : 'disconnected');
    setSyncStatus(prev => ({ ...prev, isConnected: data.connected }));
  }, []);

  const handleSyncStarted = useCallback(() => {
    setSyncStatus(prev => ({ ...prev, syncInProgress: true }));
    setSyncStats(prev => ({ ...prev, totalSyncs: prev.totalSyncs + 1 }));
  }, []);

  const handleSyncCompleted = useCallback((data) => {
    setSyncStatus(prev => ({ 
      ...prev, 
      syncInProgress: false, 
      lastSync: data.timestamp 
    }));
    setSyncStats(prev => ({ 
      ...prev, 
      successfulSyncs: prev.successfulSyncs + 1,
      lastSyncDuration: Date.now() - new Date(data.timestamp).getTime()
    }));
    addRealtimeUpdate('sync_completed', 'Full sync completed successfully', 'success');
  }, []);

  const handleSyncFailed = useCallback((data) => {
    setSyncStatus(prev => ({ ...prev, syncInProgress: false }));
    setSyncStats(prev => ({ ...prev, failedSyncs: prev.failedSyncs + 1 }));
    addRealtimeUpdate('sync_failed', `Sync failed: ${data.error}`, 'error');
  }, []);

  const handleTrayStatusUpdate = useCallback((data) => {
    addRealtimeUpdate('tray_status', `Tray ${data.tray_id} status changed to ${data.status}`, 'info');
  }, []);

  const handleCaseAssignmentUpdate = useCallback((data) => {
    addRealtimeUpdate('case_assignment', `Case ${data.case_id} assignment updated`, 'info');
  }, []);

  const handleSyncError = useCallback((error) => {
    setSyncStatus(prev => ({
      ...prev,
      errors: [...prev.errors, error]
    }));
    addRealtimeUpdate('error', error.message, 'error');
  }, []);

  const handleWebSocketConnected = useCallback(() => {
    setConnectionStatus('realtime');
    addRealtimeUpdate('websocket', 'Real-time connection established', 'success');
  }, []);

  const handleWebSocketDisconnected = useCallback(() => {
    setConnectionStatus('connected');
    addRealtimeUpdate('websocket', 'Real-time connection lost, falling back to polling', 'warning');
  }, []);

  // Helper function to add real-time updates
  const addRealtimeUpdate = (type, message, severity) => {
    const update = {
      id: Date.now(),
      type,
      message,
      severity,
      timestamp: new Date().toISOString()
    };
    
    setRealtimeUpdates(prev => [update, ...prev.slice(0, 49)]); // Keep last 50 updates
  };

  // Manual sync functions
  const handleManualSync = async () => {
    try {
      await trayTrackerSync.performFullSync();
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  };

  const handleTestConnection = async () => {
    try {
      setConnectionStatus('testing');
      await trayTrackerSync.testConnection();
      setConnectionStatus('connected');
      addRealtimeUpdate('connection_test', 'Connection test successful', 'success');
    } catch (error) {
      setConnectionStatus('error');
      addRealtimeUpdate('connection_test', `Connection test failed: ${error.message}`, 'error');
    }
  };

  const toggleAutoSync = (enabled) => {
    setAutoSyncEnabled(enabled);
    if (enabled) {
      trayTrackerSync.startPeriodicSync();
      addRealtimeUpdate('auto_sync', 'Automatic sync enabled', 'info');
    } else {
      trayTrackerSync.stopPeriodicSync();
      addRealtimeUpdate('auto_sync', 'Automatic sync disabled', 'info');
    }
  };

  // Status indicators
  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'realtime':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'testing':
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'error':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'realtime':
        return 'Real-time';
      case 'testing':
        return 'Testing...';
      case 'error':
        return 'Error';
      default:
        return 'Disconnected';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'realtime':
        return 'bg-blue-100 text-blue-800';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'sync_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sync_failed':
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'tray_status':
      case 'case_assignment':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'websocket':
        return <Zap className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <ArrowLeftRight className="h-8 w-8 text-blue-600" />
          TrayTracker Bi-Directional Sync
        </h1>
        <p className="text-gray-600">Real-time synchronization between Medical CRM and TrayTracker systems</p>
      </div>

      {/* Connection Status Banner */}
      <Alert className={`mb-6 ${connectionStatus === 'error' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
        <div className="flex items-center gap-2">
          {getConnectionStatusIcon()}
          <AlertDescription className="flex-1">
            <span className="font-medium">Connection Status: </span>
            <Badge className={getConnectionStatusColor()}>
              {getConnectionStatusText()}
            </Badge>
            {syncStatus.lastSync && (
              <span className="ml-4 text-sm text-gray-600">
                Last sync: {formatTimestamp(syncStatus.lastSync)}
              </span>
            )}
          </AlertDescription>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={connectionStatus === 'testing'}
            >
              Test Connection
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSync}
              disabled={syncStatus.syncInProgress}
            >
              {syncStatus.syncInProgress ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Manual Sync
            </Button>
          </div>
        </div>
      </Alert>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'realtime', label: 'Real-time Updates', icon: Zap },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sync Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Sync Statistics
              </CardTitle>
              <CardDescription>
                Overview of synchronization performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{syncStats.totalSyncs}</div>
                  <div className="text-sm text-gray-600">Total Syncs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{syncStats.successfulSyncs}</div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{syncStats.failedSyncs}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((syncStats.successfulSyncs / Math.max(syncStats.totalSyncs, 1)) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sync Directions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5" />
                Sync Directions
              </CardTitle>
              <CardDescription>
                Data flow between systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Outbound to TrayTracker</span>
                  </div>
                  <Badge variant="outline">Cases, Updates</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Inbound from TrayTracker</span>
                  </div>
                  <Badge variant="outline">Tray Status, Assignments</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Real-time Updates</span>
                  </div>
                  <Badge variant="outline" className={connectionStatus === 'realtime' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {connectionStatus === 'realtime' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Errors */}
          {syncStatus.errors.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Recent Errors
                </CardTitle>
                <CardDescription>
                  Latest synchronization errors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {syncStatus.errors.slice(-5).map((error, index) => (
                    <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                      <div className="font-medium text-red-800">{error.type}</div>
                      <div className="text-red-600">{error.message}</div>
                      <div className="text-red-500 text-xs">{formatTimestamp(error.timestamp)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'realtime' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time Updates
            </CardTitle>
            <CardDescription>
              Live feed of synchronization events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {realtimeUpdates.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No real-time updates yet
                </div>
              ) : (
                realtimeUpdates.map((update) => (
                  <div key={update.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                    {getUpdateIcon(update.type)}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{update.message}</div>
                      <div className="text-xs text-gray-500">{formatTimestamp(update.timestamp)}</div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        update.severity === 'success' ? 'bg-green-100 text-green-800' :
                        update.severity === 'error' ? 'bg-red-100 text-red-800' :
                        update.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }
                    >
                      {update.type}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sync Settings</CardTitle>
              <CardDescription>
                Configure synchronization behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Automatic Sync</div>
                  <div className="text-sm text-gray-600">Enable periodic synchronization</div>
                </div>
                <Switch
                  checked={autoSyncEnabled}
                  onCheckedChange={toggleAutoSync}
                />
              </div>
              
              <div className="border-t pt-4">
                <div className="font-medium mb-2">Sync Interval</div>
                <select className="w-full p-2 border border-gray-300 rounded-lg">
                  <option value="1">Every 1 minute</option>
                  <option value="5" selected>Every 5 minutes</option>
                  <option value="10">Every 10 minutes</option>
                  <option value="30">Every 30 minutes</option>
                </select>
              </div>
              
              <div className="border-t pt-4">
                <div className="font-medium mb-2">Real-time Updates</div>
                <div className="text-sm text-gray-600 mb-2">
                  WebSocket connection for instant updates
                </div>
                <Badge className={connectionStatus === 'realtime' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {connectionStatus === 'realtime' ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connection Info</CardTitle>
              <CardDescription>
                TrayTracker API connection details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-medium">API Endpoint</div>
                <div className="text-sm text-gray-600 font-mono">
                  {process.env.REACT_APP_TRAYTRACKER_API_URL || 'https://api.traytracker.com'}
                </div>
              </div>
              
              <div>
                <div className="font-medium">Connection Type</div>
                <div className="text-sm text-gray-600">
                  {connectionStatus === 'realtime' ? 'WebSocket + REST API' : 'REST API Only'}
                </div>
              </div>
              
              <div>
                <div className="font-medium">Last Connection Test</div>
                <div className="text-sm text-gray-600">
                  {formatTimestamp(syncStatus.lastSync)}
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={connectionStatus === 'testing'}
                className="w-full"
              >
                {connectionStatus === 'testing' ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Wifi className="h-4 w-4 mr-2" />
                )}
                Test Connection
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TrayTrackerBiDirectionalSync;

