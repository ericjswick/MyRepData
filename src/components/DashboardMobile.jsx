import React, { useState } from 'react'
import { Calendar, TrendingUp, Users, Building2, Package, Clock, MapPin, User, Plus, Eye, Edit, X } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import physiciansData from '../data/physicians.json'
import facilitiesData from '../data/facilities.json'

function DashboardMobile({ onNavigate }) {
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false)
  const [showScheduleCaseModal, setShowScheduleCaseModal] = useState(false)
  const [appointmentForm, setAppointmentForm] = useState({
    title: '',
    physician: '',
    date: '',
    time: '',
    type: '',
    notes: ''
  })
  const [caseForm, setCaseForm] = useState({
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
      name: `${caseType} Primary Tray`,
      required: true,
      notes: `Primary tray for ${caseType} procedures`
    }
    
    const backupTray = {
      name: `${caseType} Backup Tray`,
      required: false,
      notes: `Backup tray for ${caseType} procedures`
    }
    
    return [primaryTray, backupTray]
  }

  const handleAddAppointment = () => {
    console.log('Add appointment clicked')
    setShowAddAppointmentModal(true)
  }

  const handleCloseAppointmentModal = () => {
    setShowAddAppointmentModal(false)
    setAppointmentForm({
      title: '',
      physician: '',
      date: '',
      time: '',
      type: '',
      notes: ''
    })
  }

  const handleAppointmentFormChange = (field, value) => {
    setAppointmentForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveAppointment = () => {
    console.log('Saving appointment:', appointmentForm)
    // Here you would typically save to backend
    handleCloseAppointmentModal()
  }

  const handleScheduleCase = () => {
    console.log('Schedule case clicked')
    setShowScheduleCaseModal(true)
  }

  const handleCloseCaseModal = () => {
    setShowScheduleCaseModal(false)
    setCaseForm({
      caseType: '',
      physician: '',
      facility: '',
      date: '',
      time: '',
      duration: '',
      notes: '',
      requiredTrays: []
    })
  }

  const handleCaseFormChange = (field, value) => {
    setCaseForm(prev => {
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

  const handleSaveCase = () => {
    console.log('Saving case:', caseForm)
    // Here you would typically save to backend
    handleCloseCaseModal()
  }

  const stats = [
    { label: 'Total Physicians', value: '2', icon: Users, color: 'text-blue-600' },
    { label: 'Active Facilities', value: '3', icon: Building2, color: 'text-green-600' },
    { label: 'Tracked Trays', value: '8', icon: Package, color: 'text-orange-600' },
    { label: 'This Month', value: '12', icon: TrendingUp, color: 'text-purple-600' }
  ]

  const upcomingAppointments = [
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
  ]

  const recentActivities = [
    {
      id: 1,
      title: 'Product Demo at Advanced Spine Center',
      facility: 'Advanced Spine Center',
      date: '2025-08-11',
      status: 'Completed',
      type: 'Visit'
    },
    {
      id: 2,
      title: 'Follow-up on SI Joint procedure',
      facility: 'Access Medical Center',
      date: '2025-08-10',
      status: 'Completed',
      type: 'Call'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your medical sales operations</p>
        </div>
        <div className="flex items-center justify-between">
          <Badge className="bg-green-100 text-green-800">
            Live
          </Badge>
          <p className="text-sm text-gray-600">
            Tuesday, August 26, 2025
          </p>
        </div>
      </div>

      {/* Surgical Cases Section */}
      <Card className="bg-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Surgical Cases</h2>
              <p className="text-blue-100">Track upcoming and recent surgical procedures</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleScheduleCase}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Schedule
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => onNavigate && onNavigate('cases')}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                View All
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm text-blue-100">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-blue-100">Recent</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-16 flex flex-col gap-1"
              onClick={() => onNavigate && onNavigate('physicians')}
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs">Add Physician</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col gap-1"
              onClick={() => onNavigate && onNavigate('facilities')}
            >
              <Building2 className="w-5 h-5" />
              <span className="text-xs">Add Facility</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col gap-1"
              onClick={() => onNavigate && onNavigate('scheduling')}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Schedule</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col gap-1"
              onClick={() => onNavigate && onNavigate('tray-tracking')}
            >
              <Package className="w-5 h-5" />
              <span className="text-xs">Track Trays</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddAppointment}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
          <CardDescription>Next scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">{appointment.title}</h4>
                <p className="text-xs text-gray-600">{appointment.physician}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-gray-500">{appointment.date}</span>
                  <span className="text-xs text-gray-500">{appointment.time}</span>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {appointment.type}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Activities</CardTitle>
          <CardDescription>Latest sales activities and interactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                <p className="text-xs text-gray-600">{activity.facility}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{activity.date}</span>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {activity.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats - Moved to Bottom */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add Appointment Modal */}
      {showAddAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Add Appointment</h2>
                <button 
                  onClick={handleCloseAppointmentModal}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Title
                  </label>
                  <input
                    type="text"
                    value={appointmentForm.title}
                    onChange={(e) => handleAppointmentFormChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter appointment title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Physician
                  </label>
                  <select
                    value={appointmentForm.physician}
                    onChange={(e) => handleAppointmentFormChange('physician', e.target.value)}
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
                    Date
                  </label>
                  <input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => handleAppointmentFormChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={appointmentForm.time}
                    onChange={(e) => handleAppointmentFormChange('time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={appointmentForm.type}
                    onChange={(e) => handleAppointmentFormChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Demo">Product Demo</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={appointmentForm.notes}
                    onChange={(e) => handleAppointmentFormChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional notes or details"
                  />
                </div>
              </form>
              
              <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                <button 
                  onClick={handleCloseAppointmentModal}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveAppointment}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Case Modal */}
      {showScheduleCaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Schedule New Case</h2>
                <button 
                  onClick={handleCloseCaseModal}
                  className="text-white hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
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
                      value={caseForm.caseType}
                      onChange={(e) => handleCaseFormChange('caseType', e.target.value)}
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
                      value={caseForm.physician}
                      onChange={(e) => handleCaseFormChange('physician', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Physician</option>
                      <option value="Dr. Branko Prpa">Dr. Branko Prpa - Spine Surgery</option>
                      <option value="Dr. Sarah Johnson">Dr. Sarah Johnson - Orthopedic Surgery</option>
                      <option value="Dr. Michael Chen">Dr. Michael Chen - Joint Replacement</option>
                      <option value="Dr. Emily Rodriguez">Dr. Emily Rodriguez - Sports Medicine</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facility
                    </label>
                    <select
                      value={caseForm.facility}
                      onChange={(e) => handleCaseFormChange('facility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Facility</option>
                      <option value="Advanced Spine Center">Advanced Spine Center (Surgical Facility)</option>
                      <option value="Access Medical Center">Access Medical Center (Hospital)</option>
                      <option value="Regional Orthopedic Hospital">Regional Orthopedic Hospital (Hospital)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={caseForm.date}
                      onChange={(e) => handleCaseFormChange('date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={caseForm.time}
                      onChange={(e) => handleCaseFormChange('time', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={caseForm.duration}
                      onChange={(e) => handleCaseFormChange('duration', e.target.value)}
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
                    value={caseForm.notes}
                    onChange={(e) => handleCaseFormChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter procedure notes and special requirements..."
                  />
                </div>

                {/* Tray Requirements Section */}
                {caseForm.requiredTrays.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Trays
                    </label>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      {caseForm.requiredTrays.map((tray, index) => (
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
                  onClick={handleCloseCaseModal}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveCase}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Schedule Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardMobile

