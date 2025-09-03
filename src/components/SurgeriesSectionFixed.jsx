import React, { useState } from 'react'
import { Calendar, Clock, MapPin, User, Plus, Eye, Edit, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import CalendarIntegration from '@/components/CalendarIntegration.jsx'
import physiciansData from '../data/physicians.json'
import facilitiesData from '../data/facilities.json'

function SurgeriesSectionFixed() {
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [selectedSurgery, setSelectedSurgery] = useState(null)
  const [showCaseDetails, setShowCaseDetails] = useState(false)
  const [selectedCase, setSelectedCase] = useState(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCase, setEditingCase] = useState(null)
  
  // Form state for Schedule Surgery modal
  const [scheduleForm, setScheduleForm] = useState({
    caseType: '',
    physician: '',
    facility: '',
    date: '',
    time: '',
    duration: '',
    notes: '',
    requiredTrays: []
  })

  // Function to generate default trays based on case type
  const generateDefaultTrays = (caseType) => {
    if (!caseType) return []
    
    const primaryTray = {
      id: `${caseType.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_primary`,
      name: `${caseType} Primary Tray`,
      required: true,
      notes: `Primary tray for ${caseType} procedures`,
      status: 'pending'
    }
    
    const backupTray = {
      id: `${caseType.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_backup`,
      name: `${caseType} Backup Tray`,
      required: false,
      notes: `Backup tray for ${caseType} procedures (optional)`,
      status: 'pending'
    }
    
    return [primaryTray, backupTray]
  }
  
  const [surgicalCases, setSurgicalCases] = useState([
    {
      id: 1,
      procedure: 'L4-L5 Fusion',
      physician: 'Dr. Branko Prpa',
      facility: 'Advanced Spine Center (Neenah WI)',
      date: '2025-08-24',
      time: '8:00 AM',
      duration: 180,
      status: 'scheduled',
      notes: 'Posterior approach with instrumentation',
      surgeryType: 'Spine fusion – Short construct',
    },
    {
      id: 2,
      procedure: 'Cervical Discectomy',
      physician: 'Dr. Max Ots',
      facility: 'Access Medical Center',
      date: '2025-08-25',
      time: '10:30 AM',
      duration: 120,
      status: 'confirmed',
      notes: 'C5-C6 level',
      surgeryType: 'Spine fusion – Short construct',
    }
  ])

  const handleViewDetails = (surgery) => {
    console.log('Opening case details for:', surgery.procedure)
    setSelectedCase(surgery)
    setShowCaseDetails(true)
  }

  const handleEditSurgery = (surgery) => {
    console.log('Opening edit modal for:', surgery.procedure)
    setEditingCase({...surgery})
    setShowEditModal(true)
  }

  const handleScheduleSurgery = () => {
    console.log('Opening schedule surgery modal')
    setShowScheduleModal(true)
  }

  const handleAddToCalendar = (surgery) => {
    console.log('Opening calendar integration for:', surgery.procedure)
    setSelectedSurgery(surgery)
    setShowCalendarModal(true)
  }

  // Form handlers for Schedule Surgery modal
  const handleScheduleFormChange = (field, value) => {
    setScheduleForm(prev => {
      const updated = {
        ...prev,
        [field]: value
      }
      
      // Generate default trays when case type changes
      if (field === 'caseType') {
        updated.requiredTrays = generateDefaultTrays(value)
      }
      
      return updated
    })
  }

  const handleSaveSchedule = () => {
    const newCase = {
      id: surgicalCases.length + 1,
      procedure: scheduleForm.caseType,
      physician: scheduleForm.physician,
      facility: scheduleForm.facility,
      date: scheduleForm.date,
      time: scheduleForm.time,
      duration: parseInt(scheduleForm.duration) || 120,
      status: 'scheduled',
      notes: scheduleForm.notes,
      surgeryType: scheduleForm.caseType,
    }
    
    setSurgicalCases([...surgicalCases, newCase])
    setScheduleForm({
      caseType: '',
      physician: '',
      facility: '',
      date: '',
      time: '',
      duration: '',
      notes: ''
    })
    setShowScheduleModal(false)
  }

  const handleCloseScheduleModal = () => {
    setScheduleForm({
      caseType: '',
      physician: '',
      facility: '',
      date: '',
      time: '',
      duration: '',
      notes: '',
      requiredTrays: []
    })
    setShowScheduleModal(false)
  }

  const handleSaveEdit = () => {
    setSurgicalCases(surgicalCases.map(c => 
      c.id === editingCase.id ? editingCase : c
    ))
    setShowEditModal(false)
    setEditingCase(null)
    console.log('Surgery updated successfully')
  }

  const handleScheduleNew = (newCase) => {
    const newId = Math.max(...surgicalCases.map(c => c.id)) + 1
    setSurgicalCases([...surgicalCases, { ...newCase, id: newId }])
    setShowScheduleModal(false)
    console.log('New surgery scheduled successfully')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Surgical Cases</h2>
          <p className="text-sm text-gray-600">Track upcoming and recent surgical procedures</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          onClick={handleScheduleSurgery}
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Surgery
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-blue-600">{surgicalCases.length}</p>
              </div>
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-600">{surgicalCases.length}</p>
              </div>
              <Calendar className="h-6 w-6 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Surgery Cards */}
      <div className="space-y-4">
        {surgicalCases.map((surgery) => (
          <Card key={surgery.id} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Date Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {new Date(surgery.date).getDate()}
                      </div>
                      <div className="text-sm opacity-90">
                        {formatDate(surgery.date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{surgery.time}</div>
                    <div className="text-sm opacity-90">
                      {surgery.status === 'scheduled' ? 'Scheduled' : 'Confirmed'}
                    </div>
                  </div>
                  <Badge className={getStatusColor(surgery.status)}>
                    {surgery.status}
                  </Badge>
                </div>
              </div>

              {/* Surgery Details */}
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {surgery.procedure}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{surgery.physician}</p>
                      <p className="text-xs text-gray-600">Treating Physician</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{surgery.facility}</p>
                      <p className="text-xs text-gray-600">Surgical Facility</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{surgery.duration} minutes</p>
                      <p className="text-xs text-gray-600">Estimated Duration</p>
                    </div>
                  </div>
                </div>

                {surgery.notes && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900 mb-1">Notes:</p>
                    <p className="text-sm text-gray-700">{surgery.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewDetails(surgery)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditSurgery(surgery)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Surgery
                    </Button>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleAddToCalendar(surgery)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Case Details Modal */}
      {showCaseDetails && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Case Details - {selectedCase.procedure}</h2>
                <button 
                  onClick={() => setShowCaseDetails(false)}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Surgery Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Procedure:</span>
                        <span className="font-medium">{selectedCase.procedure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{formatDate(selectedCase.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{selectedCase.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{selectedCase.duration} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(selectedCase.status)}>
                          {selectedCase.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Team & Location</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{selectedCase.physician}</p>
                        <p className="text-sm text-gray-600">Treating Physician</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{selectedCase.facility}</p>
                        <p className="text-sm text-gray-600">Surgical Facility</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedCase.notes && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Clinical Notes</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{selectedCase.notes}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button 
                    onClick={() => setShowCaseDetails(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      handleEditSurgery(selectedCase)
                      setShowCaseDetails(false)
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit Case
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Surgery Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Schedule New Surgery</h2>
                <button 
                  onClick={handleCloseScheduleModal}
                  className="text-white hover:text-gray-200"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Case Type
                    </label>
                    <select
                      value={scheduleForm.caseType}
                      onChange={(e) => handleScheduleFormChange('caseType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Case Type</option>
                      <option value="SI fusion – lateral">SI fusion – lateral</option>
                      <option value="SI fusion – Intra–articular">SI fusion – Intra–articular</option>
                      <option value="SI fusion – Oblique/Postero lateral">SI fusion – Oblique/Postero lateral</option>
                      <option value="SI fusion – Medial to lateral">SI fusion – Medial to lateral</option>
                      <option value="Spine fusion – Long Construct">Spine fusion – Long Construct</option>
                      <option value="Spine fusion – Short construct">Spine fusion – Short construct</option>
                      <option value="Sacral fracture – TNT/TORQ">Sacral fracture – TNT/TORQ</option>
                      <option value="+ Add New Case Type">+ Add New Case Type</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Treating Physician
                    </label>
                    <select
                      value={scheduleForm.physician}
                      onChange={(e) => handleScheduleFormChange('physician', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Physician</option>
                      {physiciansData.map((physician) => (
                        <option key={physician.id} value={physician.full_name}>
                          {physician.full_name} - {physician.specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facility
                    </label>
                    <select
                      value={scheduleForm.facility}
                      onChange={(e) => handleScheduleFormChange('facility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Facility</option>
                      {facilitiesData.map((facility) => (
                        <option key={facility.id} value={facility.account_name}>
                          {facility.account_name} - {facility.address.city}, {facility.address.state}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={scheduleForm.date}
                      onChange={(e) => handleScheduleFormChange('date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={scheduleForm.time}
                      onChange={(e) => handleScheduleFormChange('time', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={scheduleForm.duration}
                      onChange={(e) => handleScheduleFormChange('duration', e.target.value)}
                      placeholder="120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Procedure Notes
                  </label>
                  <textarea
                    value={scheduleForm.notes}
                    onChange={(e) => handleScheduleFormChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter procedure notes and special requirements..."
                  />
                </div>

                {/* Tray Requirements Section */}
                {scheduleForm.requiredTrays.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Trays
                    </label>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      {scheduleForm.requiredTrays.map((tray, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md border">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${tray.required ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                              <span className="font-medium text-gray-900">{tray.name}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                tray.required 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {tray.required ? 'Required' : 'Optional'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{tray.notes}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
              
              <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                <button 
                  onClick={handleCloseScheduleModal}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveSchedule}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Schedule Surgery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Surgery Modal */}
      {showEditModal && editingCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Edit Surgery - {editingCase.procedure}</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Procedure Name
                    </label>
                    <input
                      type="text"
                      value={editingCase.procedure || ''}
                      onChange={(e) => setEditingCase({...editingCase, procedure: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Physician
                    </label>
                    <select
                      value={editingCase.physician || ''}
                      onChange={(e) => setEditingCase({...editingCase, physician: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Physician</option>
                      {physiciansData.map((physician) => (
                        <option key={physician.id} value={physician.full_name}>
                          {physician.full_name} - {physician.specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facility
                    </label>
                    <select
                      value={editingCase.facility || ''}
                      onChange={(e) => setEditingCase({...editingCase, facility: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Facility</option>
                      <option value="Advanced Spine Center">Advanced Spine Center</option>
                      <option value="Regional Medical Center">Regional Medical Center</option>
                      <option value="Access Medical Center">Access Medical Center</option>
                      <option value="Milwaukee Surgical Center">Milwaukee Surgical Center</option>
                      <option value="Wisconsin Spine Institute">Wisconsin Spine Institute</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={editingCase.date || ''}
                      onChange={(e) => setEditingCase({...editingCase, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={editingCase.time ? editingCase.time.replace(/\s?(AM|PM)/i, '') : ''}
                      onChange={(e) => {
                        const time = e.target.value
                        const [hours, minutes] = time.split(':')
                        const hour12 = hours > 12 ? hours - 12 : hours
                        const ampm = hours >= 12 ? 'PM' : 'AM'
                        setEditingCase({...editingCase, time: `${hour12}:${minutes} ${ampm}`})
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={editingCase.duration || ''}
                      onChange={(e) => setEditingCase({...editingCase, duration: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editingCase.status || ''}
                      onChange={(e) => setEditingCase({...editingCase, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Status</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surgery Type
                    </label>
                    <select
                      value={editingCase.surgeryType || ''}
                      onChange={(e) => setEditingCase({...editingCase, surgeryType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Surgery Type</option>
                      <option value="Spinal Fusion">Spinal Fusion</option>
                      <option value="Discectomy">Discectomy</option>
                      <option value="Laminectomy">Laminectomy</option>
                      <option value="Cervical Surgery">Cervical Surgery</option>
                      <option value="Lumbar Surgery">Lumbar Surgery</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinical Notes
                  </label>
                  <textarea
                    value={editingCase.notes || ''}
                    onChange={(e) => setEditingCase({...editingCase, notes: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter clinical notes, special instructions, or additional details..."
                  />
                </div>
              </form>
              
              <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Integration Modal */}
      {showCalendarModal && selectedSurgery && (
        <CalendarIntegration
          isOpen={showCalendarModal}
          onClose={() => {
            setShowCalendarModal(false)
            setSelectedSurgery(null)
          }}
          appointment={{
            title: selectedSurgery.procedure,
            date: selectedSurgery.date,
            time: selectedSurgery.time,
            description: `${selectedSurgery.procedure} with ${selectedSurgery.physician} at ${selectedSurgery.facility}`
          }}
        />
      )}
    </div>
  )
}

export default SurgeriesSectionFixed

