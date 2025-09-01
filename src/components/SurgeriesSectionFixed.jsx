import { useState } from 'react'
import { Calendar, Clock, MapPin, User, Plus, Eye, Edit, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import CalendarIntegration from '@/components/CalendarIntegration.jsx'

function SurgeriesSectionFixed() {
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [selectedSurgery, setSelectedSurgery] = useState(null)
  const [showCaseDetails, setShowCaseDetails] = useState(false)
  const [selectedCase, setSelectedCase] = useState(null)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCase, setEditingCase] = useState(null)
  const [surgicalCases, setSurgicalCases] = useState([
    {
      id: 1,
      procedure: 'L4-L5 Fusion',
      physician: 'Dr. Branko Prpa',
      facility: 'Advanced Spine Center',
      date: '2025-08-24',
      time: '8:00 AM',
      duration: 180,
      status: 'scheduled',
      notes: 'Posterior approach with instrumentation',
      patientName: 'John Smith',
      patientAge: 65,
      surgeryType: 'Spinal Fusion',
      anesthesia: 'General',
      estimatedCost: '$45,000'
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
      notes: 'C5-C6 level',
      patientName: 'Jane Doe',
      patientAge: 52,
      surgeryType: 'Discectomy',
      anesthesia: 'General',
      estimatedCost: '$28,000'
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

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Patient Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Patient:</span>
                        <span className="font-medium">{selectedCase.patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span className="font-medium">{selectedCase.patientAge} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Surgery Type:</span>
                        <span className="font-medium">{selectedCase.surgeryType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Anesthesia:</span>
                        <span className="font-medium">{selectedCase.anesthesia}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Cost:</span>
                        <span className="font-medium">{selectedCase.estimatedCost}</span>
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
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Schedule New Surgery</h2>
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Schedule a new surgical procedure</p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    handleScheduleNew({
                      procedure: 'New Procedure',
                      physician: 'Dr. New Physician',
                      facility: 'New Facility',
                      date: '2025-08-26',
                      time: '2:00 PM',
                      duration: 90,
                      status: 'scheduled',
                      notes: 'New surgery scheduled',
                      patientName: 'New Patient',
                      patientAge: 45,
                      surgeryType: 'General',
                      anesthesia: 'General',
                      estimatedCost: '$25,000'
                    })
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                      <option value="Dr. Branko Prpa">Dr. Branko Prpa</option>
                      <option value="Dr. Max Ots">Dr. Max Ots</option>
                      <option value="Dr. John Smith">Dr. John Smith</option>
                      <option value="Dr. Jane Doe">Dr. Jane Doe</option>
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
                      Patient Name
                    </label>
                    <input
                      type="text"
                      value={editingCase.patientName || ''}
                      onChange={(e) => setEditingCase({...editingCase, patientName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Age
                    </label>
                    <input
                      type="number"
                      value={editingCase.patientAge || ''}
                      onChange={(e) => setEditingCase({...editingCase, patientAge: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anesthesia Type
                    </label>
                    <select
                      value={editingCase.anesthesia || ''}
                      onChange={(e) => setEditingCase({...editingCase, anesthesia: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Anesthesia</option>
                      <option value="General">General</option>
                      <option value="Local">Local</option>
                      <option value="Regional">Regional</option>
                      <option value="Spinal">Spinal</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Cost
                    </label>
                    <input
                      type="text"
                      value={editingCase.estimatedCost || ''}
                      onChange={(e) => setEditingCase({...editingCase, estimatedCost: e.target.value})}
                      placeholder="$25,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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

