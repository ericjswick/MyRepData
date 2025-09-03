import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, AlertTriangle, CheckCircle, RefreshCw, Settings, BarChart3, Plus } from 'lucide-react';

const EnhancedTrayTrackerDashboard = () => {
  const [selectedCaseType, setSelectedCaseType] = useState('L4-L5 Fusion');
  const [selectedPhysician, setSelectedPhysician] = useState('Dr. John Smith');
  const [selectedFacility, setSelectedFacility] = useState('Advanced Spine Center');
  const [trayRequirements, setTrayRequirements] = useState([]);
  const [trayAvailability, setTrayAvailability] = useState({});
  const [upcomingCases, setUpcomingCases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  // Mock data for case types and their tray requirements
  const caseTypes = [
    'SI fusion – lateral',
    'SI fusion – Intra–articular', 
    'SI fusion – Oblique/Postero lateral',
    'SI fusion – Medial to lateral',
    'Spine fusion – Long Construct',
    'Spine fusion – Short construct',
    'Sacral fracture – TNT/TORQ'
  ];

  const physicians = [
    'Dr. John Smith',
    'Dr. Jane Doe',
    'Dr. Michael Johnson',
    'Dr. Sarah Wilson'
  ];

  const facilities = [
    'Advanced Spine Center',
    'Regional Medical Center',
    'Milwaukee Surgical Center',
    'Wisconsin Spine Institute'
  ];

  // Function to generate tray requirements based on case type
  const generateTrayRequirements = (caseType) => {
    if (!caseType) return []
    
    const primaryTray = {
      tray_id: `${caseType.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_primary`,
      tray_name: `${caseType} Primary Tray`,
      requirement_type: 'required',
      quantity: 1,
      priority: 1
    }
    
    const backupTray = {
      tray_id: `${caseType.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_backup`,
      tray_name: `${caseType} Backup Tray`,
      requirement_type: 'optional',
      quantity: 1,
      priority: 2
    }
    
    return [primaryTray, backupTray]
  }

  // Mock tray requirements data using the new naming convention
  const mockTrayRequirements = {
    'SI fusion – lateral': generateTrayRequirements('SI fusion – lateral'),
    'SI fusion – Intra–articular': generateTrayRequirements('SI fusion – Intra–articular'),
    'SI fusion – Oblique/Postero lateral': generateTrayRequirements('SI fusion – Oblique/Postero lateral'),
    'SI fusion – Medial to lateral': generateTrayRequirements('SI fusion – Medial to lateral'),
    'Spine fusion – Long Construct': generateTrayRequirements('Spine fusion – Long Construct'),
    'Spine fusion – Short construct': generateTrayRequirements('Spine fusion – Short construct'),
    'Sacral fracture – TNT/TORQ': generateTrayRequirements('Sacral fracture – TNT/TORQ')
  };

  // Mock tray availability data
  const mockTrayAvailability = {
    'si_fusion___lateral_primary': { status: 'available', location: 'OR Suite 1', last_cleaned: '2024-08-30 06:00' },
    'si_fusion___lateral_backup': { status: 'available', location: 'Sterile Storage', last_cleaned: '2024-08-30 05:30' },
    'si_fusion___intra_articular_primary': { status: 'in_use', location: 'OR Suite 3', expected_available: '2024-08-30 14:00' },
    'si_fusion___intra_articular_backup': { status: 'available', location: 'Sterile Storage', last_cleaned: '2024-08-30 06:30' },
    'si_fusion___oblique_postero_lateral_primary': { status: 'cleaning', location: 'Sterilization', expected_available: '2024-08-30 12:00' },
    'si_fusion___oblique_postero_lateral_backup': { status: 'available', location: 'OR Suite 2', last_cleaned: '2024-08-30 07:00' },
    'si_fusion___medial_to_lateral_primary': { status: 'available', location: 'OR Suite 4', last_cleaned: '2024-08-30 05:45' },
    'si_fusion___medial_to_lateral_backup': { status: 'available', location: 'Sterile Storage', last_cleaned: '2024-08-30 06:15' },
    'spine_fusion___long_construct_primary': { status: 'maintenance', location: 'Repair Shop', expected_available: '2024-08-31 08:00' },
    'spine_fusion___long_construct_backup': { status: 'available', location: 'Neuro Storage', last_cleaned: '2024-08-30 06:30' },
    'spine_fusion___short_construct_primary': { status: 'available', location: 'OR Suite 1', last_cleaned: '2024-08-30 06:00' },
    'spine_fusion___short_construct_backup': { status: 'available', location: 'Sterile Storage', last_cleaned: '2024-08-30 05:30' },
    'sacral_fracture___tnt_torq_primary': { status: 'available', location: 'OR Suite 2', last_cleaned: '2024-08-30 07:00' },
    'sacral_fracture___tnt_torq_backup': { status: 'cleaning', location: 'Sterilization', expected_available: '2024-08-30 12:00' }
  };

  // Mock upcoming cases with tray status
  const mockUpcomingCases = [
    {
      id: 1,
      case_type: 'SI fusion – lateral',
      physician: 'Dr. John Smith',
      facility: 'Advanced Spine Center',
      date: '2024-09-02',
      time: '08:00 AM',
      patient: 'John Doe',
      ready_for_surgery: true,
      missing_trays: []
    },
    {
      id: 2,
      case_type: 'SI fusion – Intra–articular',
      physician: 'Dr. Jane Doe',
      facility: 'Regional Medical Center',
      date: '2024-09-02',
      time: '10:30 AM',
      patient: 'Mary Johnson',
      ready_for_surgery: false,
      missing_trays: ['si_fusion___intra_articular_primary']
    },
    {
      id: 3,
      case_type: 'Spine fusion – Long Construct',
      physician: 'Dr. Michael Johnson',
      facility: 'Milwaukee Surgical Center',
      date: '2024-09-03',
      time: '09:00 AM',
      patient: 'Robert Wilson',
      ready_for_surgery: false,
      missing_trays: ['spine_fusion___long_construct_primary']
    },
    {
      id: 4,
      case_type: 'Sacral fracture – TNT/TORQ',
      physician: 'Dr. Sarah Wilson',
      facility: 'Wisconsin Spine Institute',
      date: '2024-09-04',
      time: '07:30 AM',
      patient: 'Lisa Brown',
      ready_for_surgery: true,
      missing_trays: []
    }
  ];

  useEffect(() => {
    // Simulate loading tray requirements based on selected case type
    const requirements = mockTrayRequirements[selectedCaseType] || [];
    setTrayRequirements(requirements);
    setTrayAvailability(mockTrayAvailability);
    setUpcomingCases(mockUpcomingCases);
  }, [selectedCaseType]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in_use': return 'bg-yellow-100 text-yellow-800';
      case 'cleaning': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequirementColor = (type) => {
    switch (type) {
      case 'required': return 'bg-red-100 text-red-800 border-red-200';
      case 'preferred': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'optional': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Quick Action Handlers
  const handleScheduleCase = () => {
    alert(`Scheduling new case with auto tray assignment for ${selectedCaseType}\nPhysician: ${selectedPhysician}\nFacility: ${selectedFacility}`);
  };

  const handleSyncAvailability = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLastSyncTime(new Date());
      setIsLoading(false);
      alert('Tray availability synced successfully from TrayTracker!');
    }, 2000);
  };

  const handlePhysicianPreferences = () => {
    alert(`Opening physician preferences for ${selectedPhysician}\nManage tray settings for different case types`);
  };

  const handleUtilizationReport = () => {
    alert(`Generating utilization report for:\nCase Type: ${selectedCaseType}\nPhysician: ${selectedPhysician}\nFacility: ${selectedFacility}`);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Enhanced TrayTracker Dashboard</h1>
        <p className="text-gray-600">Case Type-Based Tray Management with Physician Preferences</p>
      </div>

      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Case Type</label>
          <select 
            value={selectedCaseType}
            onChange={(e) => setSelectedCaseType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {caseTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Physician</label>
          <select 
            value={selectedPhysician}
            onChange={(e) => setSelectedPhysician(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {physicians.map(physician => (
              <option key={physician} value={physician}>{physician}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Facility</label>
          <select 
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {facilities.map(facility => (
              <option key={facility} value={facility}>{facility}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tray Requirements Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Tray Requirements for {selectedCaseType}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trayRequirements.map((tray, index) => {
            const availability = trayAvailability[tray.tray_id] || { status: 'unknown' };
            return (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{tray.tray_name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRequirementColor(tray.requirement_type)}`}>
                    {tray.requirement_type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Tray ID: {tray.tray_id}</p>
                <p className="text-sm text-gray-600 mb-3">Quantity: {tray.quantity}</p>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(availability.status)}`}>
                      {availability.status}
                    </span>
                  </div>
                  {availability.location && (
                    <p className="text-xs text-gray-500">Location: {availability.location}</p>
                  )}
                  {availability.last_cleaned && (
                    <p className="text-xs text-gray-500">Last cleaned: {availability.last_cleaned}</p>
                  )}
                  {availability.expected_available && (
                    <p className="text-xs text-gray-500">Available: {availability.expected_available}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Cases with Tray Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Cases - Tray Readiness</h2>
        <div className="space-y-4">
          {upcomingCases.map((case_item, index) => (
            <div key={index} className={`border rounded-lg p-4 ${case_item.ready_for_surgery ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{case_item.case_type}</h3>
                  <p className="text-sm text-gray-600">{case_item.physician} • {case_item.facility}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{case_item.date}</p>
                  <p className="text-sm text-gray-600">{case_item.time}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Patient: {case_item.patient}</p>
                <div className="flex items-center space-x-2">
                  {case_item.ready_for_surgery ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      ✓ Ready for Surgery
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      ⚠ Missing Trays: {case_item.missing_trays.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={handleScheduleCase}
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex flex-col items-center"
          >
            <Plus className="w-6 h-6 text-blue-600 mb-2" />
            <div className="text-blue-600 font-medium mb-1">Schedule Case</div>
            <div className="text-sm text-blue-500 text-center">with Auto Tray Assignment</div>
          </button>
          
          <button 
            onClick={handleSyncAvailability}
            disabled={isLoading}
            className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors flex flex-col items-center disabled:opacity-50"
          >
            <RefreshCw className={`w-6 h-6 text-green-600 mb-2 ${isLoading ? 'animate-spin' : ''}`} />
            <div className="text-green-600 font-medium mb-1">
              {isLoading ? 'Syncing...' : 'Sync Availability'}
            </div>
            <div className="text-sm text-green-500 text-center">from TrayTracker</div>
          </button>
          
          <button 
            onClick={handlePhysicianPreferences}
            className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors flex flex-col items-center"
          >
            <Settings className="w-6 h-6 text-purple-600 mb-2" />
            <div className="text-purple-600 font-medium mb-1">Physician Preferences</div>
            <div className="text-sm text-purple-500 text-center">Manage Tray Settings</div>
          </button>
          
          <button 
            onClick={handleUtilizationReport}
            className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors flex flex-col items-center"
          >
            <BarChart3 className="w-6 h-6 text-orange-600 mb-2" />
            <div className="text-orange-600 font-medium mb-1">Utilization Report</div>
            <div className="text-sm text-orange-500 text-center">Tray Usage Analytics</div>
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
          <span className="text-green-800 font-medium">Connected to TrayTracker API</span>
          <span className="ml-2 text-green-600 text-sm">
            • Last sync: {lastSyncTime.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTrayTrackerDashboard;

