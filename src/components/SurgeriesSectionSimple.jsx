import React, { useState } from 'react'
import { Calendar, Clock, MapPin, User, Stethoscope, Plus, List, Eye, Edit3, CalendarPlus } from 'lucide-react'
import CalendarIntegration from './CalendarIntegration.jsx'

const SurgeriesSectionSimple = () => {
  const [viewMode, setViewMode] = useState('list')
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [selectedSurgery, setSelectedSurgery] = useState(null)

  const mockSurgeries = [
    {
      id: 1,
      procedure_name: 'L4-L5 Fusion',
      physician_name: 'Dr. Branko Prpa',
      facility_name: 'Advanced Spine Center',
      surgery_date: '2025-08-24',
      surgery_time: '08:00',
      estimated_duration: 180,
      status: 'scheduled',
      case_type: 'Primary',
      notes: 'Posterior approach with instrumentation'
    },
    {
      id: 2,
      procedure_name: 'Cervical Discectomy',
      physician_name: 'Dr. Max Ots',
      facility_name: 'Regional Medical Center',
      surgery_date: '2025-08-25',
      surgery_time: '10:30',
      estimated_duration: 120,
      status: 'confirmed',
      case_type: 'Revision',
      notes: 'C5-C6 level'
    }
  ]

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddToCalendar = (surgery) => {
    // Convert surgery data to appointment format for calendar integration
    const appointmentData = {
      title: surgery.procedure_name,
      description: `${surgery.case_type} surgery with ${surgery.physician_name} at ${surgery.facility_name}`,
      appointment_type: 'Surgery',
      scheduled_date: surgery.surgery_date,
      scheduled_time: surgery.surgery_time,
      duration_minutes: surgery.estimated_duration,
      physician: { full_name: surgery.physician_name },
      facility: { account_name: surgery.facility_name },
      notes: surgery.notes
    }
    setSelectedSurgery(appointmentData)
    setShowCalendarModal(true)
  }

  const handleCalendarSuccess = (result) => {
    console.log('Calendar integration successful:', result)
    setShowCalendarModal(false)
    setSelectedSurgery(null)
  }

  const handleCalendarClose = () => {
    setShowCalendarModal(false)
    setSelectedSurgery(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-xl">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Surgical Cases</h2>
              <p className="text-blue-100 mt-1">Track upcoming and recent surgical procedures</p>
            </div>
          </div>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Schedule Surgery</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-semibold">Upcoming</p>
                <p className="text-2xl font-bold text-blue-800">{mockSurgeries.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 font-semibold">Recent</p>
                <p className="text-2xl font-bold text-gray-800">0</p>
              </div>
              <Calendar className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </button>
          </div>
        </div>

        {/* Surgery List */}
        <div className="space-y-4">
          {mockSurgeries.map((surgery) => (
            <div key={surgery.id} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              {/* Date and Time Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{surgery.surgery_date.split('-')[2]}</div>
                      <div className="text-sm text-blue-200">Aug</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{formatTime(surgery.surgery_time)}</div>
                      <div className="text-blue-200">Sunday</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(surgery.status)}`}>
                      {surgery.status}
                    </span>
                    <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {surgery.case_type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Surgery Details */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900">{surgery.procedure_name}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{surgery.physician_name}</p>
                      <p className="text-gray-600">Treating Physician</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{surgery.facility_name}</p>
                      <p className="text-gray-600">Surgical Facility</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">{surgery.estimated_duration} minutes</p>
                      <p className="text-gray-600">Estimated Duration</p>
                    </div>
                  </div>
                </div>

                {surgery.notes && (
                  <div className="bg-white bg-opacity-60 rounded-lg p-3">
                    <p className="text-sm text-gray-700"><strong>Notes:</strong> {surgery.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Surgery</span>
                  </button>
                  <button 
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={() => handleAddToCalendar(surgery)}
                  >
                    <CalendarPlus className="h-4 w-4" />
                    <span>Add to Calendar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Integration Modal */}
      {showCalendarModal && selectedSurgery && (
        <CalendarIntegration
          appointment={selectedSurgery}
          onClose={handleCalendarClose}
          onSuccess={handleCalendarSuccess}
        />
      )}
    </div>
  )
}

export default SurgeriesSectionSimple

