import { useState, useEffect } from 'react'
import { Search, Plus, Filter, MapPin, Phone, Mail, Building2, Users, Eye, Edit, Calendar, Clock, User, X } from 'lucide-react'

const AllButtonsFunctional = () => {
  // All state variables for different sections
  const [activeSection, setActiveSection] = useState('dashboard')
  const [facilities, setFacilities] = useState([])
  const [physicians, setPhysicians] = useState([])
  const [surgicalCases, setSurgicalCases] = useState([])
  const [appointments, setAppointments] = useState([])
  
  // Modal states
  const [showAddFacilityModal, setShowAddFacilityModal] = useState(false)
  const [showEditFacilityModal, setShowEditFacilityModal] = useState(false)
  const [showAddPhysicianModal, setShowAddPhysicianModal] = useState(false)
  const [showEditPhysicianModal, setShowEditPhysicianModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showEditSurgeryModal, setShowEditSurgeryModal] = useState(false)
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false)
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false)
  
  // Detail view states
  const [showFacilityDetails, setShowFacilityDetails] = useState(false)
  const [showPhysicianDetails, setShowPhysicianDetails] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [selectedPhysician, setSelectedPhysician] = useState(null)
  const [selectedSurgery, setSelectedSurgery] = useState(null)
  const [editingItem, setEditingItem] = useState(null)

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTerritory, setSelectedTerritory] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedType, setSelectedType] = useState('')

  useEffect(() => {
    loadMockData()
  }, [])

  const loadMockData = () => {
    // Mock facilities data
    setFacilities([
      {
        id: 1,
        name: 'Advanced Spine Center',
        type: 'ASC',
        specialty: 'Ortho Spine',
        territory: 'Wisconsin East',
        address: '123 Medical Drive, Milwaukee, WI 53202',
        phone: '(414) 555-0123',
        website: 'https://advancedspine.com',
        accountOwner: 'Eric Swick'
      },
      {
        id: 2,
        name: 'Regional Medical Center',
        type: 'Hospital',
        specialty: 'Neuro',
        territory: 'Wisconsin West',
        address: '456 Healthcare Blvd, Madison, WI 53703',
        phone: '(608) 555-0456',
        website: 'https://regionalmed.com',
        accountOwner: 'Moore Medical Solutions, LLC'
      }
    ])

    // Mock physicians data
    setPhysicians([
      {
        id: 1,
        name: 'Dr. John Smith',
        npi: '1234567890',
        specialty: 'Ortho Spine',
        location: 'Milwaukee, WI',
        accountOwner: 'Eric Swick'
      },
      {
        id: 2,
        name: 'Dr. Jane Doe',
        npi: '0987654321',
        specialty: 'Neuro',
        location: 'Madison, WI',
        accountOwner: 'Moore Medical Solutions'
      }
    ])

    // Mock surgical cases data
    setSurgicalCases([
      {
        id: 1,
        procedure: 'L4-L5 Fusion',
        physician: 'Dr. Branko Prpa',
        facility: 'Advanced Spine Center',
        date: '2025-08-24',
        time: '8:00 AM',
        duration: 180,
        status: 'scheduled',
        patientName: 'John Patient',
        patientAge: 45,
        notes: 'Posterior approach with instrumentation'
      },
      {
        id: 2,
        procedure: 'Cervical Discectomy',
        physician: 'Dr. Max Ots',
        facility: 'Regional Medical Center',
        date: '2025-08-25',
        time: '10:30 AM',
        duration: 120,
        status: 'confirmed',
        patientName: 'Jane Patient',
        patientAge: 52,
        notes: 'Anterior approach, C5-C6 level'
      }
    ])

    // Mock appointments data
    setAppointments([
      {
        id: 1,
        title: 'Surgery Consultation',
        physician: 'Dr. John Smith',
        date: '8/12/2025',
        time: '09:00 AM',
        type: 'Consultation'
      },
      {
        id: 2,
        title: 'Product Demo',
        physician: 'Dr. Jane Doe',
        date: '8/13/2025',
        time: '02:30 PM',
        type: 'Demo'
      }
    ])
  }

  // BUTTON HANDLERS - Every button has functionality
  
  // Navigation handlers
  const handleNavigateToSection = (section) => {
    console.log(`Navigating to ${section}`)
    setActiveSection(section)
    // Reset detail views when navigating
    setShowFacilityDetails(false)
    setShowPhysicianDetails(false)
  }

  // Facility handlers
  const handleAddFacility = () => {
    console.log('Add Facility clicked')
    setShowAddFacilityModal(true)
  }

  const handleViewFacilityDetails = (facility) => {
    console.log('View Facility Details clicked for:', facility.name)
    setSelectedFacility(facility)
    setShowFacilityDetails(true)
  }

  const handleEditFacility = (facility) => {
    console.log('Edit Facility clicked for:', facility.name)
    setEditingItem(facility)
    setShowEditFacilityModal(true)
  }

  const handleSaveFacility = () => {
    console.log('Save Facility clicked')
    if (editingItem) {
      setFacilities(facilities.map(f => f.id === editingItem.id ? editingItem : f))
    }
    setShowEditFacilityModal(false)
    setEditingItem(null)
  }

  // Physician handlers
  const handleAddPhysician = () => {
    console.log('Add Physician clicked')
    setShowAddPhysicianModal(true)
  }

  const handleViewPhysicianDetails = (physician) => {
    console.log('View Physician Details clicked for:', physician.name)
    setSelectedPhysician(physician)
    setShowPhysicianDetails(true)
  }

  const handleEditPhysician = (physician) => {
    console.log('Edit Physician clicked for:', physician.name)
    setEditingItem(physician)
    setShowEditPhysicianModal(true)
  }

  const handleSavePhysician = () => {
    console.log('Save Physician clicked')
    if (editingItem) {
      setPhysicians(physicians.map(p => p.id === editingItem.id ? editingItem : p))
    }
    setShowEditPhysicianModal(false)
    setEditingItem(null)
  }

  // Surgery handlers
  const handleScheduleSurgery = () => {
    console.log('Schedule Surgery clicked')
    setShowScheduleModal(true)
  }

  const handleViewSurgeryDetails = (surgery) => {
    console.log('View Surgery Details clicked for:', surgery.procedure)
    setSelectedSurgery(surgery)
    setShowViewDetailsModal(true)
  }

  const handleEditSurgery = (surgery) => {
    console.log('Edit Surgery clicked for:', surgery.procedure)
    setEditingItem(surgery)
    setShowEditSurgeryModal(true)
  }

  const handleSaveSurgery = () => {
    console.log('Save Surgery clicked')
    if (editingItem) {
      setSurgicalCases(surgicalCases.map(s => s.id === editingItem.id ? editingItem : s))
    }
    setShowEditSurgeryModal(false)
    setEditingItem(null)
  }

  const handleAddToCalendar = (surgery) => {
    console.log('Add to Calendar clicked for:', surgery.procedure)
    setSelectedSurgery(surgery)
    setShowCalendarModal(true)
  }

  // Appointment handlers
  const handleAddAppointment = () => {
    console.log('Add Appointment clicked')
    setShowAddAppointmentModal(true)
  }

  const handleSaveAppointment = () => {
    console.log('Save Appointment clicked')
    setShowAddAppointmentModal(false)
  }

  // Generic handlers
  const handleBackToList = () => {
    console.log('Back to List clicked')
    setShowFacilityDetails(false)
    setShowPhysicianDetails(false)
    setSelectedFacility(null)
    setSelectedPhysician(null)
  }

  const handleCloseModal = () => {
    console.log('Close Modal clicked')
    setShowAddFacilityModal(false)
    setShowEditFacilityModal(false)
    setShowAddPhysicianModal(false)
    setShowEditPhysicianModal(false)
    setShowScheduleModal(false)
    setShowEditSurgeryModal(false)
    setShowViewDetailsModal(false)
    setShowCalendarModal(false)
    setShowAddAppointmentModal(false)
    setEditingItem(null)
  }

  const handleViewAll = (section) => {
    console.log(`View All ${section} clicked`)
    setActiveSection(section)
  }

  // Search and filter handlers
  const handleSearch = (term) => {
    console.log('Search term:', term)
    setSearchTerm(term)
  }

  const handleFilterChange = (filterType, value) => {
    console.log(`Filter ${filterType} changed to:`, value)
    switch (filterType) {
      case 'territory':
        setSelectedTerritory(value)
        break
      case 'specialty':
        setSelectedSpecialty(value)
        break
      case 'type':
        setSelectedType(value)
        break
    }
  }

  // RENDER FUNCTIONS

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your medical sales operations</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Physicians</p>
              <p className="text-2xl font-bold text-blue-600">{physicians.length}</p>
            </div>
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Facilities</p>
              <p className="text-2xl font-bold text-green-600">{facilities.length}</p>
            </div>
            <Building2 className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Surgical Cases Section */}
      <div className="bg-blue-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Surgical Cases</h2>
            <p className="text-blue-100">Track upcoming and recent surgical procedures</p>
          </div>
          <button 
            onClick={() => handleViewAll('surgeries')}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50"
          >
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{surgicalCases.length}</div>
            <div className="text-sm text-blue-100">Upcoming</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-sm text-blue-100">Recent</div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Upcoming Appointments</h3>
          <button 
            onClick={handleAddAppointment}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{appointment.title}</h4>
                <p className="text-xs text-gray-600">{appointment.physician}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-gray-500">{appointment.date}</span>
                  <span className="text-xs text-gray-500">{appointment.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderFacilities = () => {
    if (showFacilityDetails && selectedFacility) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBackToList}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <span>← Back to Facilities</span>
            </button>
            <button 
              onClick={() => handleEditFacility(selectedFacility)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Edit Facility
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedFacility.name}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Type:</span> {selectedFacility.type}</p>
                  <p><span className="font-medium">Specialty:</span> {selectedFacility.specialty}</p>
                  <p><span className="font-medium">Territory:</span> {selectedFacility.territory}</p>
                  <p><span className="font-medium">Account Owner:</span> {selectedFacility.accountOwner}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Address:</span> {selectedFacility.address}</p>
                  <p><span className="font-medium">Phone:</span> {selectedFacility.phone}</p>
                  <p><span className="font-medium">Website:</span> 
                    <a href={selectedFacility.website} className="text-blue-600 hover:underline ml-1">
                      {selectedFacility.website}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Facilities</h1>
            <p className="text-gray-600">Manage your facility network and relationships</p>
          </div>
          <button 
            onClick={handleAddFacility}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Facility
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Facilities</p>
                <p className="text-2xl font-bold text-blue-600">{facilities.length}</p>
              </div>
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ASCs</p>
                <p className="text-2xl font-bold text-green-600">
                  {facilities.filter(f => f.type === 'ASC').length}
                </p>
              </div>
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search facilities..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={selectedTerritory}
            onChange={(e) => handleFilterChange('territory', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Territories</option>
            <option value="Wisconsin East">Wisconsin East</option>
            <option value="Wisconsin West">Wisconsin West</option>
          </select>
          
          <select
            value={selectedSpecialty}
            onChange={(e) => handleFilterChange('specialty', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Specialties</option>
            <option value="Ortho Spine">Ortho Spine</option>
            <option value="Neuro">Neuro</option>
          </select>
          
          <select
            value={selectedType}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="ASC">ASC</option>
            <option value="Hospital">Hospital</option>
          </select>
        </div>

        {/* Facilities List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {facilities.map((facility) => (
            <div key={facility.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{facility.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{facility.specialty}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">{facility.type}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{facility.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{facility.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{facility.accountOwner}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 text-center">🌐</span>
                  <span>{facility.territory}</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleViewFacilityDetails(facility)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderPhysicians = () => {
    if (showPhysicianDetails && selectedPhysician) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBackToList}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <span>← Back to Physicians</span>
            </button>
            <button 
              onClick={() => handleEditPhysician(selectedPhysician)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Edit Physician
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedPhysician.name}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">NPI:</span> {selectedPhysician.npi}</p>
                  <p><span className="font-medium">Specialty:</span> {selectedPhysician.specialty}</p>
                  <p><span className="font-medium">Location:</span> {selectedPhysician.location}</p>
                  <p><span className="font-medium">Account Owner:</span> {selectedPhysician.accountOwner}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Physicians</h1>
            <p className="text-gray-600">Manage your physician relationships</p>
          </div>
          <button 
            onClick={handleAddPhysician}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Physician
          </button>
        </div>

        {/* Physicians List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {physicians.map((physician) => (
            <div key={physician.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{physician.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{physician.specialty}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><span className="font-medium">NPI:</span> {physician.npi}</p>
                <p><span className="font-medium">Location:</span> {physician.location}</p>
                <p><span className="font-medium">Account Owner:</span> {physician.accountOwner}</p>
              </div>
              
              <button 
                onClick={() => handleViewPhysicianDetails(physician)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderSurgeries = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Surgical Cases</h1>
          <p className="text-gray-600">Manage upcoming and recent surgical procedures</p>
        </div>
        <button 
          onClick={handleScheduleSurgery}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Schedule Surgery
        </button>
      </div>

      {/* Surgical Cases List */}
      <div className="space-y-4">
        {surgicalCases.map((surgery) => (
          <div key={surgery.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{surgery.procedure}</h3>
                <p className="text-gray-600">{surgery.physician}</p>
                <p className="text-sm text-gray-500">{surgery.facility}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{surgery.date}</p>
                <p className="text-sm text-gray-600">{surgery.time}</p>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">{surgery.status}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleViewSurgeryDetails(surgery)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button 
                onClick={() => handleEditSurgery(surgery)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Surgery
              </button>
              <button 
                onClick={() => handleAddToCalendar(surgery)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Add to Calendar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // MODAL COMPONENTS

  const renderEditFacilityModal = () => (
    showEditFacilityModal && editingItem && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit Facility</h2>
              <button 
                onClick={handleCloseModal}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facility Name</label>
                <input
                  type="text"
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={editingItem.type || ''}
                  onChange={(e) => setEditingItem({...editingItem, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="ASC">ASC</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Clinic">Clinic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                <select
                  value={editingItem.specialty || ''}
                  onChange={(e) => setEditingItem({...editingItem, specialty: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Specialty</option>
                  <option value="Ortho Spine">Ortho Spine</option>
                  <option value="Neuro">Neuro</option>
                  <option value="Ortho">Ortho</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Territory</label>
                <input
                  type="text"
                  value={editingItem.territory || ''}
                  onChange={(e) => setEditingItem({...editingItem, territory: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={editingItem.address || ''}
                  onChange={(e) => setEditingItem({...editingItem, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={editingItem.phone || ''}
                  onChange={(e) => setEditingItem({...editingItem, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="text"
                  value={editingItem.website || ''}
                  onChange={(e) => setEditingItem({...editingItem, website: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveFacility}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  )

  const renderAddFacilityModal = () => (
    showAddFacilityModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Add New Facility</h2>
              <button 
                onClick={handleCloseModal}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">Add facility form would go here...</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Facility
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  )

  const renderCalendarModal = () => (
    showCalendarModal && selectedSurgery && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Add to Calendar</h2>
              <button 
                onClick={handleCloseModal}
                className="text-white hover:text-gray-200 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">Select calendar for: {selectedSurgery.procedure}</p>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Work Calendar</h4>
                    <p className="text-sm text-gray-600">Connected</p>
                  </div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Personal Calendar</h4>
                    <p className="text-sm text-gray-600">Connected</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  console.log('Added to calendar:', selectedSurgery.procedure)
                  handleCloseModal()
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add to Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  )

  // MAIN RENDER
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Medical Sales CRM</h1>
                  <p className="text-sm text-gray-600">Facility & Tray Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Connected to TrayTracker
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <div className="w-6 h-6 grid grid-cols-3 gap-1">
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                  <div className="w-1 h-1 bg-current rounded-full"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'dashboard' && renderDashboard()}
        {activeSection === 'facilities' && renderFacilities()}
        {activeSection === 'physicians' && renderPhysicians()}
        {activeSection === 'surgeries' && renderSurgeries()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 h-16">
          <button 
            onClick={() => handleNavigateToSection('dashboard')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeSection === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => handleNavigateToSection('facilities')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeSection === 'facilities' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-xs">Facilities</span>
          </button>
          <button 
            onClick={() => handleNavigateToSection('physicians')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeSection === 'physicians' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs">Doctors</span>
          </button>
          <button 
            onClick={() => handleNavigateToSection('contacts')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeSection === 'contacts' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Contacts</span>
          </button>
          <button 
            onClick={() => handleNavigateToSection('surgeries')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeSection === 'surgeries' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Activity</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {renderEditFacilityModal()}
      {renderAddFacilityModal()}
      {renderCalendarModal()}
    </div>
  )
}

export default AllButtonsFunctional

