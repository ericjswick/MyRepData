import { useState } from 'react'
import { Calendar, Clock, MapPin, User, Plus, Eye, Edit, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import CalendarIntegration from '@/components/CalendarIntegration.jsx'

function SurgeriesSectionMobile() {
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [selectedSurgery, setSelectedSurgery] = useState(null)
  const [showCaseDetails, setShowCaseDetails] = useState(false)
  const [selectedCase, setSelectedCase] = useState(null)

  // Mock surgical cases data
  const surgicalCases = [
    {
      id: 1,
      procedure: 'L4-L5 Fusion',
      physician: 'Dr. Branko Prpa',
      facility: 'Advanced Spine Center',
      date: '2025-08-24',
      time: '8:00 AM',
      duration: 180,
      status: 'scheduled',
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
      notes: 'C5-C6 level'
    }
  ]

  const handleViewDetails = (surgery) => {
    console.log('View details for surgery:', surgery)
    setSelectedCase(surgery)
    setShowCaseDetails(true)
  }

  const handleEditSurgery = (surgery) => {
    console.log('Edit surgery:', surgery)
    // Add edit logic here
  }

  const handleScheduleSurgery = () => {
    console.log('Schedule new surgery')
    // Add schedule logic here
  }

  const handleAddToCalendar = (surgery) => {
    setSelectedSurgery(surgery)
    setShowCalendarModal(true)
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
                <p className="text-2xl font-bold text-blue-600">2</p>
              </div>
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent</p>
                <p className="text-2xl font-bold text-gray-600">0</p>
              </div>
              <Calendar className="h-6 w-6 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button variant="default" size="sm" className="flex-1">
          <Eye className="w-4 h-4 mr-2" />
          List
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Calendar className="w-4 h-4 mr-2" />
          Calendar
        </Button>
      </div>

      {/* Surgical Cases List */}
      <div className="space-y-4">
        {surgicalCases.map((surgery) => (
          <Card key={surgery.id} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Date Header */}
              <div className="bg-blue-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      {new Date(surgery.date).getDate()}
                    </div>
                    <div className="text-sm opacity-90">
                      {formatDate(surgery.date)}
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
       )}

      {/* Case Details Modal */}
      {showCaseDetails && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Case Details</h2>
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
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedCase.procedure}
                  </h3>
                  <Badge className={getStatusColor(selectedCase.status)}>
                    {selectedCase.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Surgery Information</h4>
                    <div className="space-y-3">
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
                        <span className="font-medium capitalize">{selectedCase.status}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Team & Location</h4>
                    <div className="space-y-3">
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
                </div>

                {selectedCase.notes && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Notes</h4>
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

export default SurgeriesSectionMobile

