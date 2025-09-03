import React, { useState, useEffect } from 'react';
import { Calendar, List, Plus, Search, Filter, Clock, MapPin, User, Building2, Package, Edit, Trash2, Eye, CheckCircle, AlertCircle, XCircle, CalendarPlus, Share2, Mail, MessageSquare } from 'lucide-react';
import physiciansData from '../data/physicians.json';
import facilitiesData from '../data/facilities.json';

const CasesModule = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFacility, setFilterFacility] = useState('all');
  const [filterPhysician, setFilterPhysician] = useState('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [cases, setCases] = useState([]);

  // Mock data for scheduled cases
  const mockCases = [
    {
      id: 1,
      case_type: 'SI fusion – lateral',
      procedure_name: 'L4-L5 Posterior Spinal Fusion',
      physician: 'Dr. Branko Prpa',
      physician_id: 1,
      facility: 'Advanced Spine Center (Neenah WI)',
      facility_id: 1,
      facility_type: 'ASC',
      date: '2024-09-02',
      time: '08:00 AM',
      duration: 180,
      status: 'confirmed',
      required_trays: ['SPINE-001', 'INST-001', 'GRAFT-001'],
      tray_status: 'ready',
      notes: 'Posterior approach with instrumentation'
    },
    {
      id: 2,
      case_type: 'SI fusion – Intra–articular',
      procedure_name: 'C5-C6 Anterior Cervical Discectomy',
      physician: 'Dr. Max Ots',
      physician_id: 2,
      facility: 'Access Medical Center',
      facility_id: 2,
      facility_type: 'ASC',
      date: '2024-09-02',
      time: '10:30 AM',
      duration: 120,
      status: 'pending',
      required_trays: ['CERV-001', 'MICRO-001'],
      tray_status: 'missing',
      notes: 'Anterior approach with fusion'
    },
    {
      id: 3,
      case_type: 'Spine fusion – Long Construct',
      procedure_name: 'L3-L4 Lumbar Laminectomy',
      physician: 'Dr. Shekhar Dagam',
      physician_id: 3,
      facility: 'Milwaukee Surgical Suites',
      facility_id: 3,
      facility_type: 'ASC',
      date: '2024-09-03',
      time: '09:00 AM',
      duration: 90,
      status: 'confirmed',
      required_trays: ['LUMB-001', 'LAMIN-001'],
      tray_status: 'ready',
      notes: 'Decompression only'
    },
    {
      id: 4,
      case_type: 'SI fusion – Oblique/Postero lateral',
      procedure_name: 'T11-T12 Posterior Fusion',
      physician: 'Dr. Vishal Patel',
      physician_id: 4,
      facility: 'Wisconsin Spine Institute',
      facility_id: 4,
      facility_type: 'Hospital',
      date: '2024-09-04',
      time: '07:30 AM',
      duration: 240,
      patient_name: 'Lisa Brown',
      patient_age: 48,
      status: 'scheduled',
      required_trays: ['THOR-001', 'INST-002', 'GRAFT-002'],
      tray_status: 'partial',
      notes: 'Complex thoracic fusion with instrumentation'
    },
    {
      id: 5,
      case_type: 'Spine fusion – Short construct',
      procedure_name: 'C4-C5-C6 Posterior Cervical Fusion',
      physician: 'Dr. John Smith',
      physician_id: 1,
      facility: 'Advanced Spine Center',
      facility_id: 1,
      facility_type: 'ASC',
      date: '2024-09-05',
      time: '08:30 AM',
      duration: 200,
      patient_name: 'David Miller',
      patient_age: 55,
      status: 'confirmed',
      required_trays: ['CERV-002', 'INST-001', 'GRAFT-001'],
      tray_status: 'ready',
      notes: 'Multi-level cervical fusion'
    }
  ];

  // Available options for dropdowns
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
    { id: 1, name: 'Dr. John Smith', specialty: 'Ortho Spine' },
    { id: 2, name: 'Dr. Jane Doe', specialty: 'Neurosurgery' },
    { id: 3, name: 'Dr. Michael Johnson', specialty: 'Ortho Spine' },
    { id: 4, name: 'Dr. Sarah Wilson', specialty: 'Neurosurgery' }
  ];

  const facilities = [
    { id: 1, name: 'Advanced Spine Center', type: 'ASC' },
    { id: 2, name: 'Regional Medical Center', type: 'Hospital' },
    { id: 3, name: 'Milwaukee Surgical Center', type: 'ASC' },
    { id: 4, name: 'Wisconsin Spine Institute', type: 'Hospital' },
    { id: 5, name: 'Access Medical Center', type: 'OBL' }
  ];

  useEffect(() => {
    setCases(mockCases);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrayStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'missing': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrayStatusIcon = (status) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'partial': return <AlertCircle className="w-4 h-4" />;
      case 'missing': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const filteredCases = cases.filter(case_item => {
    const matchesSearch = case_item.case_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_item.physician.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_item.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || case_item.status === filterStatus;
    const matchesFacility = filterFacility === 'all' || case_item.facility_id.toString() === filterFacility;
    const matchesPhysician = filterPhysician === 'all' || case_item.physician_id.toString() === filterPhysician;
    
    return matchesSearch && matchesStatus && matchesFacility && matchesPhysician;
  });

  const handleScheduleCase = () => {
    setShowScheduleModal(true);
  };

  const handleViewCase = (case_item) => {
    setSelectedCase(case_item);
  };

  const handleEditCase = (case_item) => {
    setSelectedCase(case_item);
    setShowScheduleModal(true);
  };

  const handleImportToCalendar = (case_item) => {
    // Create calendar event data with consistent structure
    // Event name: Case Type, Physician (Doctor)
    const eventTitle = `${case_item.case_type}, ${case_item.physician}`;
    
    // Location: Facility name & address
    const facilityLocation = case_item.facility_address ? 
      `${case_item.facility}, ${case_item.facility_address}` : 
      case_item.facility;
    
    // Notes: Any additional details
    const eventDetails = case_item.notes ? 
      `${case_item.notes}\n\nDuration: ${case_item.duration} minutes\nTray Status: ${case_item.tray_status}` :
      `Duration: ${case_item.duration} minutes\nTray Status: ${case_item.tray_status}`;
    
    // Create date object for the event
    const eventDate = new Date(`${case_item.date} ${case_item.time}`);
    const endDate = new Date(eventDate.getTime() + (case_item.duration * 60000)); // Add duration in milliseconds
    
    // Format dates for calendar URL
    const startDateStr = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDateStr = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    // Create Google Calendar URL with consistent structure
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDateStr}/${endDateStr}&details=${encodeURIComponent(eventDetails)}&location=${encodeURIComponent(facilityLocation)}`;
    
    // Open calendar in new tab
    window.open(googleCalendarUrl, '_blank');
  };

  const handleShareCase = (case_item) => {
    const shareText = `Surgical Case: ${case_item.case_type}\n\nProcedure: ${case_item.procedure_name}\nPhysician: ${case_item.physician}\nFacility: ${case_item.facility}\nDate: ${case_item.date} at ${case_item.time}\nDuration: ${case_item.duration} minutes\n\nTray Status: ${case_item.tray_status}\nRequired Trays: ${case_item.required_trays.length}`;
    
    if (navigator.share) {
      // Use native sharing if available (mobile devices)
      navigator.share({
        title: `Surgical Case: ${case_item.case_type}`,
        text: shareText,
      });
    } else {
      // Fallback: copy to clipboard and show options
      navigator.clipboard.writeText(shareText).then(() => {
        // Show sharing options
        const emailSubject = encodeURIComponent(`Surgical Case: ${case_item.case_type}`);
        const emailBody = encodeURIComponent(shareText);
        const smsBody = encodeURIComponent(shareText);
        
        const shareOptions = `
          Case details copied to clipboard!
          
          Share via:
          • Email: mailto:?subject=${emailSubject}&body=${emailBody}
          • SMS: sms:?body=${smsBody}
        `;
        
        if (confirm('Case details copied to clipboard!\n\nWould you like to open email to share?')) {
          window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
        }
      });
    }
  };

  const renderListView = () => (
    <div className="space-y-6">
      {filteredCases.map((case_item) => (
        <div key={case_item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          {/* Header Section - Date & Time */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{case_item.date}</div>
                  <div className="text-lg font-semibold text-blue-600">{case_item.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleImportToCalendar(case_item)}
                  className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                  title="Import to Calendar"
                >
                  <CalendarPlus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShareCase(case_item)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Share Case"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedCase(case_item)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="p-6">
            {/* Case Type Only */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">{case_item.case_type}</h3>
            </div>

            {/* Doctor & Facility Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg mt-1">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Treating Physician</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">{case_item.physician}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg mt-1">
                  <Building2 className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Facility</div>
                  <div className="text-lg font-semibold text-gray-900 mt-1">{case_item.facility}</div>
                </div>
              </div>
            </div>

            {/* Status & Duration Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(case_item.status)}`}>
                  {case_item.status.charAt(0).toUpperCase() + case_item.status.slice(1)}
                </span>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getTrayStatusColor(case_item.tray_status)}`}>
                  {getTrayStatusIcon(case_item.tray_status)}
                  <span>Trays {case_item.tray_status}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">{case_item.duration} minutes</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCalendarView = () => {
    // Group cases by date for calendar view
    const casesByDate = filteredCases.reduce((acc, case_item) => {
      const date = case_item.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(case_item);
      return acc;
    }, {});

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendar View</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(casesByDate).map(([date, dateCases]) => (
              <div key={date} className="border rounded-lg p-4">
                <div className="font-medium text-gray-900 mb-3 border-b pb-2">
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="space-y-2">
                  {dateCases.map((case_item) => (
                    <div key={case_item.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900">{case_item.time}</h4>
                          <p className="text-sm text-gray-600">{case_item.case_type}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(case_item.status)}`}>
                          {case_item.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        <p>{case_item.physician}</p>
                        <p>{case_item.facility}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {getTrayStatusIcon(case_item.tray_status)}
                          <span className={getTrayStatusColor(case_item.tray_status).replace('bg-', 'text-').replace('-100', '-600')}>
                            Trays {case_item.tray_status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleImportToCalendar(case_item)}
                            className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="Import to Calendar"
                          >
                            <CalendarPlus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleShareCase(case_item)}
                            className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                            title="Share Case"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewCase(case_item)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleEditCase(case_item)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Edit Case"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cases Management</h1>
          <p className="text-gray-600">Schedule and manage surgical cases with tray requirements</p>
        </div>
        <button
          onClick={handleScheduleCase}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule Case
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Calendar View
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search case types, physicians, or facilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={filterPhysician}
              onChange={(e) => setFilterPhysician(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Physicians</option>
              {physicians.map(physician => (
                <option key={physician.id} value={physician.id}>{physician.name}</option>
              ))}
            </select>
            
            <select
              value={filterFacility}
              onChange={(e) => setFilterFacility(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Facilities</option>
              {facilities.map(facility => (
                <option key={facility.id} value={facility.id}>{facility.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Case Types</p>
              <p className="text-2xl font-bold text-gray-900">{cases.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ready Case Types</p>
              <p className="text-2xl font-bold text-green-600">
                {cases.filter(c => c.tray_status === 'ready').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Missing Trays</p>
              <p className="text-2xl font-bold text-red-600">
                {cases.filter(c => c.tray_status === 'missing').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-purple-600">
                {cases.filter(c => {
                  const caseDate = new Date(c.date);
                  const today = new Date();
                  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return caseDate >= today && caseDate <= weekFromNow;
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'list' ? renderListView() : renderCalendarView()}

      {/* Schedule Case Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedCase ? 'Edit Case Type' : 'Schedule New Case Type'}
                </h2>
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    setSelectedCase(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Case Type</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    {caseTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Treating Physician</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    {physicians.map(physician => (
                      <option key={physician.id} value={physician.id}>
                        {physician.name} - {physician.specialty}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facility</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    {facilities.map(facility => (
                      <option key={facility.id} value={facility.id}>
                        {facility.name} ({facility.type})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    placeholder="120"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Procedure Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enter procedure notes and special requirements..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    setSelectedCase(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Case scheduled/updated');
                    setShowScheduleModal(false);
                    setSelectedCase(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {selectedCase ? 'Update Case Type' : 'Schedule Case Type'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Case Details Modal */}
      {selectedCase && !showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Case Type Details</h2>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Case Type Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p><span className="font-medium">Type:</span> {selectedCase.case_type}</p>
                      <p><span className="font-medium">Date:</span> {selectedCase.date}</p>
                      <p><span className="font-medium">Time:</span> {selectedCase.time}</p>
                      <p><span className="font-medium">Duration:</span> {selectedCase.duration} minutes</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Care Team & Location</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p><span className="font-medium">Physician:</span> {selectedCase.physician}</p>
                      <p><span className="font-medium">Facility:</span> {selectedCase.facility}</p>
                      <p><span className="font-medium">Facility Type:</span> {selectedCase.facility_type}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCase.status)}`}>
                          {selectedCase.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Tray Requirements</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Status:</span>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrayStatusColor(selectedCase.tray_status)}`}>
                          {getTrayStatusIcon(selectedCase.tray_status)}
                          {selectedCase.tray_status}
                        </div>
                      </div>
                      <p><span className="font-medium">Required Trays:</span></p>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                        {selectedCase.required_trays.map((tray, index) => (
                          <li key={index}>{tray}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedCase.notes && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedCase.notes}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleEditCase(selectedCase)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Case Type
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesModule;


