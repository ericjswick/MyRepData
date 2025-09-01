import { useState, useEffect } from 'react'
import { Calendar, Clock, Plus, Filter, Search, MapPin, User, Stethoscope, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import CalendarIntegration from './CalendarIntegration.jsx'

const AppointmentSchedulerFixed = () => {
  const [appointments, setAppointments] = useState([])
  const [todayAppointments, setTodayAppointments] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('today')
  const [stats, setStats] = useState({})
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    appointment_type: '',
    scheduled_date: '',
    scheduled_time: '',
    duration_minutes: '',
    physician_id: '',
    facility_id: '',
    attendees: '',
    notes: '',
    calendar_integration: false
  })

  useEffect(() => {
    fetchAppointments()
    fetchTodayAppointments()
    fetchUpcomingAppointments()
    fetchStats()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setAppointments([])
    }
  }

  const fetchTodayAppointments = async () => {
    try {
      const response = await fetch('/api/appointments/today')
      const data = await response.json()
      setTodayAppointments(data.appointments || [])
    } catch (error) {
      console.error('Error fetching today appointments:', error)
      setTodayAppointments([])
    }
  }

  const fetchUpcomingAppointments = async () => {
    try {
      const response = await fetch('/api/appointments/upcoming')
      const data = await response.json()
      setUpcomingAppointments(data.appointments || [])
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error)
      setUpcomingAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/appointments/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching appointment stats:', error)
    }
  }

  const handleScheduleAppointment = () => {
    setShowScheduleModal(true)
  }

  const handleCloseModal = () => {
    setShowScheduleModal(false)
    setFormData({
      title: '',
      description: '',
      appointment_type: '',
      scheduled_date: '',
      scheduled_time: '',
      duration_minutes: '',
      physician_id: '',
      facility_id: '',
      attendees: '',
      notes: '',
      calendar_integration: false
    })
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        const newAppointment = await response.json()
        // Refresh appointments
        fetchAppointments()
        fetchTodayAppointments()
        fetchUpcomingAppointments()
        fetchStats()
        handleCloseModal()
        
        // If calendar integration is enabled, open calendar modal
        if (formData.calendar_integration) {
          setSelectedAppointment(newAppointment.appointment || formData)
          setShowCalendarModal(true)
        } else {
          alert('Appointment scheduled successfully!')
        }
      } else {
        alert('Error scheduling appointment')
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error)
      alert('Error scheduling appointment')
    }
  }

  const handleAddToCalendar = (appointment) => {
    setSelectedAppointment(appointment)
    setShowCalendarModal(true)
  }

  const handleCalendarSuccess = (result) => {
    console.log('Calendar integration successful:', result)
    setShowCalendarModal(false)
    setSelectedAppointment(null)
  }

  const handleCalendarClose = () => {
    setShowCalendarModal(false)
    setSelectedAppointment(null)
  }

  const getStatusColor = (status) => {
    const colors = {
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Confirmed': 'bg-green-100 text-green-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'No Show': 'bg-orange-100 text-orange-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />
      case 'No Show':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getTypeColor = (type) => {
    const colors = {
      'Surgery': 'bg-red-100 text-red-800',
      'Consultation': 'bg-blue-100 text-blue-800',
      'Follow-up': 'bg-green-100 text-green-800',
      'Demo': 'bg-purple-100 text-purple-800',
      'Training': 'bg-yellow-100 text-yellow-800',
      'Meeting': 'bg-gray-100 text-gray-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A'
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString).toLocaleDateString()
    const time = timeString ? formatTime(timeString) : ''
    return `${date} ${time}`.trim()
  }

  const AppointmentCard = ({ appointment, showDate = false }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{appointment.title}</h3>
            <p className="text-sm text-gray-600">{appointment.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getTypeColor(appointment.appointment_type)}>
              {appointment.appointment_type}
            </Badge>
            <Badge className={getStatusColor(appointment.status)}>
              <div className="flex items-center gap-1">
                {getStatusIcon(appointment.status)}
                {appointment.status}
              </div>
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          {showDate && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDateTime(appointment.scheduled_date, appointment.scheduled_time)}</span>
            </div>
          )}

          {!showDate && appointment.scheduled_time && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>{formatTime(appointment.scheduled_time)}</span>
              {appointment.duration_minutes && (
                <span className="ml-2">({appointment.duration_minutes} min)</span>
              )}
            </div>
          )}

          {appointment.physician && (
            <div className="flex items-center text-sm text-gray-600">
              <Stethoscope className="w-4 h-4 mr-2" />
              <span>{appointment.physician.full_name}</span>
            </div>
          )}

          {appointment.facility && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{appointment.facility.account_name}</span>
            </div>
          )}

          {appointment.attendees && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2" />
              <span>{appointment.attendees}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            {appointment.status === 'Scheduled' ? 'Confirm' : 'View'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => handleAddToCalendar(appointment)}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Schedule Appointment Modal
  const ScheduleAppointmentModal = () => (
    <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Schedule New Appointment
          </DialogTitle>
          <DialogDescription>
            Create a new appointment with calendar integration options
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Appointment Title *</Label>
              <Input
                id="title"
                placeholder="Enter appointment title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment_type">Appointment Type *</Label>
              <Select value={formData.appointment_type} onValueChange={(value) => handleInputChange('appointment_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Surgery">Surgery</SelectItem>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Demo">Product Demo</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter appointment description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled_date">Date *</Label>
              <Input
                id="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_time">Time *</Label>
              <Input
                id="scheduled_time"
                type="time"
                value={formData.scheduled_time}
                onChange={(e) => handleInputChange('scheduled_time', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                type="number"
                placeholder="60"
                value={formData.duration_minutes}
                onChange={(e) => handleInputChange('duration_minutes', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="physician_id">Physician</Label>
              <Select value={formData.physician_id} onValueChange={(value) => handleInputChange('physician_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select physician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Dr. John Smith</SelectItem>
                  <SelectItem value="2">Dr. Jane Doe</SelectItem>
                  <SelectItem value="3">Dr. Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facility_id">Facility</Label>
              <Select value={formData.facility_id} onValueChange={(value) => handleInputChange('facility_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Advanced Spine Center</SelectItem>
                  <SelectItem value="2">Regional Medical Center</SelectItem>
                  <SelectItem value="3">City Hospital</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attendees">Attendees</Label>
            <Input
              id="attendees"
              placeholder="Enter attendee names or emails"
              value={formData.attendees}
              onChange={(e) => handleInputChange('attendees', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or instructions"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="calendar_integration"
              checked={formData.calendar_integration}
              onChange={(e) => handleInputChange('calendar_integration', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="calendar_integration" className="text-sm">
              Add to calendar and send invitations
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Schedule Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointment Scheduler</h1>
          <p className="text-gray-600">Manage appointments, meetings, and surgical schedules</p>
        </div>
        <Button onClick={handleScheduleAppointment} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.today_appointments || 0}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcoming_appointments || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.by_status?.find(s => s.status === 'Confirmed')?.count || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.by_status?.find(s => s.status === 'Scheduled')?.count || 0}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="all">All Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Today's Schedule</h3>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {todayAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>

          {todayAppointments.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments today</h3>
                <p className="text-gray-600 mb-4">Your schedule is clear for today</p>
                <Button onClick={handleScheduleAppointment} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
            <p className="text-sm text-gray-600">Next 7 days</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} showDate={true} />
            ))}
          </div>

          {upcomingAppointments.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                <p className="text-gray-600 mb-4">Schedule your next appointments</p>
                <Button onClick={handleScheduleAppointment} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search appointments..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="Surgery">Surgery</SelectItem>
                <SelectItem value="Consultation">Consultation</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Demo">Demo</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="No Show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} showDate={true} />
            ))}
          </div>

          {appointments.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-600 mb-4">Start scheduling appointments with your physicians</p>
                <Button onClick={handleScheduleAppointment} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Schedule Appointment Modal */}
      <ScheduleAppointmentModal />

      {/* Calendar Integration Modal */}
      {showCalendarModal && selectedAppointment && (
        <CalendarIntegration
          appointment={selectedAppointment}
          onClose={handleCalendarClose}
          onSuccess={handleCalendarSuccess}
        />
      )}
    </div>
  )
}

export default AppointmentSchedulerFixed

