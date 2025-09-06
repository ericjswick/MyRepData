import React, { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, User, Stethoscope, Plus, List, ChevronDown, ArrowLeftRight, ExternalLink, Download, Eye, Edit3, CalendarPlus } from 'lucide-react'
import CalendarSelectorSimple from './CalendarSelectorSimple'
import physiciansData from '../data/physicians.json'

const SurgeriesSection = () => {
  const [viewMode, setViewMode] = useState('list') // 'list' or 'calendar'
  const [activeTab, setActiveTab] = useState('upcoming') // 'upcoming' or 'recent'
  const [surgeries, setSurgeries] = useState([])
  const [loading, setLoading] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedSurgery, setSelectedSurgery] = useState(null)
  const [showCalendarSelector, setShowCalendarSelector] = useState(false)
  const [calendarSurgery, setCalendarSurgery] = useState(null)

  useEffect(() => {
    fetchSurgeries()
  }, [activeTab])

  const fetchSurgeries = async () => {
    try {
      setLoading(true)
      
      // Fetch surgeries based on active tab
      const endpoint = activeTab === 'upcoming' ? '/api/surgeries/upcoming' : '/api/surgeries/recent'
      const response = await fetch(`${endpoint}?limit=20`)
      
      if (response.ok) {
        const data = await response.json()
        setSurgeries(data.surgeries || [])
      } else {
        // Fallback to mock data if API fails
        const mockSurgeries = [
          {
            id: 1,
            surgery_date: '2025-08-25',
            surgery_time: '08:00',
            procedure_name: 'L4-L5 Fusion',
            physician_name: 'Dr. Branko Prpa',
            facility_name: 'Advanced Spine Center',
            facility_address: '123 Medical Drive, Green Bay, WI 54301',
            status: 'scheduled',
            case_type: 'Primary',
            estimated_duration: 180,
            notes: 'Posterior approach with instrumentation'
          },
          {
            id: 2,
            surgery_date: '2025-08-26',
            surgery_time: '10:30',
            procedure_name: 'Cervical Discectomy',
            physician_name: 'Dr. Max Ots',
            facility_name: 'Regional Medical Center',
            facility_address: '456 Hospital Ave, Milwaukee, WI 53202',
            status: 'confirmed',
            case_type: 'Revision',
            estimated_duration: 120,
            notes: 'C5-C6 level'
          },
          {
            id: 3,
            surgery_date: '2025-08-27',
            surgery_time: '14:00',
            procedure_name: 'Lumbar Laminectomy',
            physician_name: 'Dr. Shekhar Dagam',
            facility_name: 'Spine Surgery Center',
            facility_address: '789 Spine Way, Madison, WI 53703',
            status: 'scheduled',
            case_type: 'Primary',
            estimated_duration: 90,
            notes: 'L3-L4 decompression'
          },
          {
            id: 4,
            surgery_date: '2025-08-22',
            surgery_time: '09:15',
            procedure_name: 'Thoracic Fusion',
            physician_name: 'Dr. Branko Prpa',
            facility_name: 'Advanced Spine Center',
            facility_address: '123 Medical Drive, Green Bay, WI 54301',
            status: 'completed',
            case_type: 'Primary',
            estimated_duration: 240,
            notes: 'T10-T12 posterior fusion'
          },
          {
            id: 5,
            surgery_date: '2025-08-21',
            surgery_time: '11:00',
            procedure_name: 'Craniotomy',
            physician_name: 'Dr. Max Ots',
            facility_name: 'Neuro Institute',
            facility_address: '321 Brain St, Milwaukee, WI 53201',
            status: 'completed',
            case_type: 'Emergency',
            estimated_duration: 300,
            notes: 'Tumor resection'
          }
        ]

        const today = new Date()
        const filtered = mockSurgeries.filter(surgery => {
          const surgeryDate = new Date(surgery.surgery_date)
          return activeTab === 'upcoming' ? surgeryDate >= today : surgeryDate < today
        })

        setSurgeries(filtered)
      }
    } catch (error) {
      console.error('Error fetching surgeries:', error)
      setSurgeries([])
    } finally {
      setLoading(false)
    }
  }

  // Calendar Integration Functions
  const formatDateForCalendar = (dateString, timeString) => {
    const date = new Date(`${dateString}T${timeString}:00`)
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const formatEndDateForCalendar = (dateString, timeString, durationMinutes) => {
    const startDate = new Date(`${dateString}T${timeString}:00`)
    const endDate = new Date(startDate.getTime() + (durationMinutes * 60000))
    return endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const generateGoogleCalendarUrl = (surgery) => {
    const startDate = formatDateForCalendar(surgery.surgery_date, surgery.surgery_time)
    const endDate = formatEndDateForCalendar(surgery.surgery_date, surgery.surgery_time, surgery.estimated_duration)
    
    const title = encodeURIComponent(`${surgery.procedure_name} - ${surgery.physician_name}`)
    const details = encodeURIComponent(
      `Surgical Procedure: ${surgery.procedure_name}\n` +
      `Physician: ${surgery.physician_name}\n` +
      `Facility: ${surgery.facility_name}\n` +
      `Duration: ${surgery.estimated_duration} minutes\n` +
      `Status: ${surgery.status}\n` +
      `Case Type: ${surgery.case_type}\n` +
      (surgery.notes ? `Notes: ${surgery.notes}\n` : '') +
      `\nAdded from Medical Sales CRM`
    )
    const location = encodeURIComponent(surgery.facility_address || surgery.facility_name)

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`
  }

  const generateOutlookUrl = (surgery) => {
    const startDate = formatDateForCalendar(surgery.surgery_date, surgery.surgery_time)
    const endDate = formatEndDateForCalendar(surgery.surgery_date, surgery.surgery_time, surgery.estimated_duration)
    
    const title = encodeURIComponent(`${surgery.procedure_name} - ${surgery.physician_name}`)
    const body = encodeURIComponent(
      `Surgical Procedure: ${surgery.procedure_name}\n` +
      `Physician: ${surgery.physician_name}\n` +
      `Facility: ${surgery.facility_name}\n` +
      `Duration: ${surgery.estimated_duration} minutes\n` +
      `Status: ${surgery.status}\n` +
      `Case Type: ${surgery.case_type}\n` +
      (surgery.notes ? `Notes: ${surgery.notes}\n` : '') +
      `\nAdded from Medical Sales CRM`
    )
    const location = encodeURIComponent(surgery.facility_address || surgery.facility_name)

    return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDate}&enddt=${endDate}&body=${body}&location=${location}`
  }

  const generateICalFile = (surgery) => {
    const startDate = formatDateForCalendar(surgery.surgery_date, surgery.surgery_time)
    const endDate = formatEndDateForCalendar(surgery.surgery_date, surgery.surgery_time, surgery.estimated_duration)
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Medical Sales CRM//Surgery Schedule//EN',
      'BEGIN:VEVENT',
      `UID:surgery-${surgery.id}-${now}@medicalsalescrm.com`,
      `DTSTAMP:${now}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${surgery.procedure_name} - ${surgery.physician_name}`,
      `DESCRIPTION:Surgical Procedure: ${surgery.procedure_name}\\n` +
      `Physician: ${surgery.physician_name}\\n` +
      `Facility: ${surgery.facility_name}\\n` +
      `Duration: ${surgery.estimated_duration} minutes\\n` +
      `Status: ${surgery.status}\\n` +
      `Case Type: ${surgery.case_type}\\n` +
      (surgery.notes ? `Notes: ${surgery.notes}\\n` : '') +
      `\\nAdded from Medical Sales CRM`,
      `LOCATION:${surgery.facility_address || surgery.facility_name}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Surgery in 30 minutes',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')

    return icalContent
  }

  // Button handlers
  const handleViewDetails = (surgery) => {
    setSelectedSurgery(surgery)
    setShowDetailsModal(true)
  }

  const handleEditSurgery = (surgery) => {
    setSelectedSurgery(surgery)
    setShowScheduleModal(true)
  }

  const handleScheduleSurgery = () => {
    setSelectedSurgery(null)
    setShowScheduleModal(true)
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const downloadICalFile = (surgery) => {
    const icalContent = generateICalFile(surgery)
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `surgery-${surgery.procedure_name.replace(/\s+/g, '-').toLowerCase()}-${surgery.surgery_date}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const CalendarIntegrationButtons = ({ surgery, isMobile = false }) => {
    if (activeTab !== 'upcoming') return null

    const buttonClass = isMobile 
      ? "flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 text-sm"
      : "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm"

    const handleAddToCalendar = (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log('Add to Calendar clicked for surgery:', surgery)
      setCalendarSurgery(surgery)
      setShowCalendarSelector(true)
    }

    return (
      <div className="relative">
        <button
          onClick={handleAddToCalendar}
          className={`${buttonClass} ${isMobile 
            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg' 
            : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          <CalendarPlus className="h-4 w-4" />
          <span>Add to Calendar</span>
        </button>
      </div>
    )
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

  const getCaseTypeColor = (caseType) => {
    switch (caseType) {
      case 'Primary': return 'bg-purple-100 text-purple-800'
      case 'Revision': return 'bg-orange-100 text-orange-800'
      case 'Emergency': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateShort = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Calendar view helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getSurgeriesForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return surgeries.filter(surgery => surgery.surgery_date === dateString)
  }

  const renderCalendarView = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border border-gray-200"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const daySurgeries = getSurgeriesForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <div key={day} className={`h-32 border border-gray-200 p-2 ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}>
          <div className={`text-lg font-bold mb-2 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {daySurgeries.slice(0, 3).map(surgery => (
              <div
                key={surgery.id}
                className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate border-l-2 border-blue-500"
                title={`${formatTime(surgery.surgery_time)} - ${surgery.procedure_name} - ${surgery.physician_name}`}
              >
                <div className="font-bold text-blue-900">{formatTime(surgery.surgery_time)}</div>
                <div className="truncate">{surgery.procedure_name}</div>
              </div>
            ))}
            {daySurgeries.length > 3 && (
              <div className="text-xs text-gray-500 font-medium">+{daySurgeries.length - 3} more</div>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="bg-white rounded-lg border shadow-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-bold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0">
          {/* Day headers */}
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-bold text-gray-700 border-b border-gray-200 bg-gray-50">
              {day}
            </div>
          ))}
          {/* Calendar days */}
          {days}
        </div>
      </div>
    )
  }

  const renderMobileListView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading surgeries...</span>
        </div>
      )
    }

    if (surgeries.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-2xl border">
          <div className="p-4 bg-blue-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No {activeTab} surgeries
          </h3>
          <p className="text-gray-600">
            {activeTab === 'upcoming' 
              ? 'No upcoming surgeries scheduled.' 
              : 'No recent surgeries found.'}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {surgeries.map((surgery) => (
          <div key={surgery.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Premium Mobile Date/Time Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-black text-white">
                      {new Date(surgery.surgery_date).getDate()}
                    </div>
                    <div className="text-sm font-semibold text-blue-100 -mt-1">
                      {new Date(surgery.surgery_date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                  <div className="border-l border-blue-400 pl-4">
                    <div className="text-2xl font-black text-white">
                      {formatTime(surgery.surgery_time)}
                    </div>
                    <div className="text-sm text-blue-100 -mt-1">
                      {new Date(surgery.surgery_date).toLocaleDateString('en-US', { weekday: 'long' })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(surgery.status)} bg-white shadow-sm`}>
                    {surgery.status.toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getCaseTypeColor(surgery.case_type)} bg-white shadow-sm`}>
                    {surgery.case_type}
                  </span>
                </div>
              </div>
            </div>

            {/* Premium Mobile Surgery Details */}
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {surgery.procedure_name}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Stethoscope className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{surgery.physician_name}</div>
                    <div className="text-sm text-gray-600">Treating Physician</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{surgery.facility_name}</div>
                    <div className="text-sm text-gray-600">Surgical Facility</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{surgery.estimated_duration} minutes</div>
                    <div className="text-sm text-gray-600">Estimated Duration</div>
                  </div>
                </div>

                {surgery.notes && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="font-semibold text-gray-900 mb-2">Notes:</div>
                    <div className="text-gray-700">{surgery.notes}</div>
                  </div>
                )}
              </div>

              {/* Premium Mobile Action Buttons */}
              <div className="space-y-3 mt-6">
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  {activeTab === 'upcoming' && (
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2">
                      <Edit3 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
                
                {/* Calendar Integration Button */}
                <CalendarIntegrationButtons surgery={surgery} isMobile={true} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderDesktopListView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading surgeries...</span>
        </div>
      )
    }

    if (surgeries.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No {activeTab} surgeries
          </h3>
          <p className="text-gray-600">
            {activeTab === 'upcoming' 
              ? 'No upcoming surgeries scheduled.' 
              : 'No recent surgeries found.'}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {surgeries.map((surgery) => (
          <div key={surgery.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            {/* Enhanced Date/Time Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {new Date(surgery.surgery_date).getDate()}
                    </div>
                    <div className="text-sm font-medium opacity-90">
                      {new Date(surgery.surgery_date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                  <div className="border-l border-blue-400 pl-4">
                    <div className="text-2xl font-bold">
                      {formatTime(surgery.surgery_time)}
                    </div>
                    <div className="text-sm opacity-90">
                      {new Date(surgery.surgery_date).toLocaleDateString('en-US', { weekday: 'long' })}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(surgery.status)} bg-white`}>
                    {surgery.status}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCaseTypeColor(surgery.case_type)} bg-white`}>
                    {surgery.case_type}
                  </span>
                </div>
              </div>
            </div>

            {/* Surgery Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {surgery.procedure_name}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-full">
                          <Stethoscope className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{surgery.physician_name}</div>
                          <div className="text-gray-500">Treating Physician</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-50 rounded-full">
                          <Building2 className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{surgery.facility_name}</div>
                          <div className="text-gray-500">Surgical Facility</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-50 rounded-full">
                          <Clock className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{surgery.estimated_duration} minutes</div>
                          <div className="text-gray-500">Estimated Duration</div>
                        </div>
                      </div>
                      {surgery.notes && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="font-medium text-gray-900 mb-1">Notes:</div>
                          <div className="text-gray-700">{surgery.notes}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-6">
                  <button 
                    onClick={() => handleViewDetails(surgery)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
                  </button>
                  {activeTab === 'upcoming' && (
                    <button 
                      onClick={() => handleEditSurgery(surgery)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Edit Surgery
                    </button>
                  )}
                  <CalendarIntegrationButtons surgery={surgery} isMobile={false} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Mobile Version */}
      <div className="lg:hidden">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 shadow-sm border border-blue-100">
          {/* Premium Mobile Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Surgical Cases</h2>
                <p className="text-gray-600 text-sm">Track procedures & schedules</p>
              </div>
            </div>
            <button 
              onClick={handleScheduleSurgery}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Premium Mobile Controls */}
          <div className="space-y-4 mb-6">
            {/* Tab Navigation */}
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                  activeTab === 'upcoming'
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Upcoming ({surgeries.filter(s => new Date(s.surgery_date) >= new Date()).length})
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                  activeTab === 'recent'
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Recent ({surgeries.filter(s => new Date(s.surgery_date) < new Date()).length})
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  viewMode === 'list'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4" />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  viewMode === 'calendar'
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </button>
            </div>
          </div>

          {/* Content */}
          {viewMode === 'list' ? renderMobileListView() : renderCalendarView()}
        </div>
      </div>

      {/* Desktop Version - Enhanced with Calendar Integration */}
      <div className="hidden lg:block">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Calendar className="h-7 w-7 text-blue-600" />
                <span>Surgical Cases</span>
              </h2>
              <p className="text-gray-600 mt-1">Track upcoming and recent surgical procedures</p>
            </div>
            <button 
              onClick={handleScheduleSurgery}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium shadow-sm transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Schedule Surgery</span>
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Upcoming ({surgeries.filter(s => new Date(s.surgery_date) >= new Date()).length})
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'recent'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Recent ({surgeries.filter(s => new Date(s.surgery_date) < new Date()).length})
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  viewMode === 'list'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4" />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  viewMode === 'calendar'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </button>
            </div>
          </div>

          {/* Content */}
          {viewMode === 'list' ? renderDesktopListView() : renderCalendarView()}
        </div>
      </div>

      {/* Surgery Details Modal */}
      {showDetailsModal && selectedSurgery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Surgery Details</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Procedure Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div><span className="font-medium">Procedure:</span> {selectedSurgery.procedure_name}</div>
                      <div><span className="font-medium">Status:</span> <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSurgery.status)}`}>{selectedSurgery.status}</span></div>
                      <div><span className="font-medium">Case Type:</span> <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getCaseTypeColor(selectedSurgery.case_type)}`}>{selectedSurgery.case_type}</span></div>
                      <div><span className="font-medium">Duration:</span> {selectedSurgery.estimated_duration} minutes</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div><span className="font-medium">Date:</span> {new Date(selectedSurgery.surgery_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      <div><span className="font-medium">Time:</span> {formatTime(selectedSurgery.surgery_time)}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Physician</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{selectedSurgery.physician_name}</span>
                      </div>
                      <div className="text-gray-600">Treating Physician</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Facility</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{selectedSurgery.facility_name}</span>
                      </div>
                      <div className="text-gray-600">Surgical Facility</div>
                    </div>
                  </div>
                </div>
              </div>
              {selectedSurgery.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedSurgery.notes}</p>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {activeTab === 'upcoming' && (
                  <button 
                    onClick={() => {
                      setShowDetailsModal(false)
                      handleEditSurgery(selectedSurgery)
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Surgery
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule/Edit Surgery Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {selectedSurgery ? 'Edit Surgery' : 'Schedule New Surgery'}
                </h2>
                <button 
                  onClick={() => setShowScheduleModal(false)}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Procedure Name</label>
                    <input 
                      type="text" 
                      defaultValue={selectedSurgery?.procedure_name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter procedure name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Physician</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select Physician</option>
                      {physiciansData.map(physician => (
                        <option 
                          key={physician.id} 
                          value={`Dr. ${physician.first_name} ${physician.last_name}`}
                          selected={selectedSurgery?.physician_name === `Dr. ${physician.first_name} ${physician.last_name}`}
                        >
                          Dr. {physician.first_name} {physician.last_name} - {physician.specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facility</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select Facility</option>
                      <option value="Advanced Spine Center" selected={selectedSurgery?.facility_name === 'Advanced Spine Center'}>Advanced Spine Center</option>
                      <option value="Regional Medical Center" selected={selectedSurgery?.facility_name === 'Regional Medical Center'}>Regional Medical Center</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Surgery Date</label>
                    <input 
                      type="date" 
                      defaultValue={selectedSurgery?.surgery_date || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Surgery Time</label>
                    <input 
                      type="time" 
                      defaultValue={selectedSurgery?.surgery_time || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (minutes)</label>
                    <input 
                      type="number" 
                      defaultValue={selectedSurgery?.estimated_duration || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Case Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="Primary" selected={selectedSurgery?.case_type === 'Primary'}>Primary</option>
                      <option value="Revision" selected={selectedSurgery?.case_type === 'Revision'}>Revision</option>
                      <option value="Emergency" selected={selectedSurgery?.case_type === 'Emergency'}>Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="scheduled" selected={selectedSurgery?.status === 'scheduled'}>Scheduled</option>
                      <option value="confirmed" selected={selectedSurgery?.status === 'confirmed'}>Confirmed</option>
                      <option value="completed" selected={selectedSurgery?.status === 'completed'}>Completed</option>
                      <option value="cancelled" selected={selectedSurgery?.status === 'cancelled'}>Cancelled</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea 
                    rows="3"
                    defaultValue={selectedSurgery?.notes || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional notes or requirements..."
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button 
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {selectedSurgery ? 'Update Surgery' : 'Schedule Surgery'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Calendar Selector */}
      {showCalendarSelector && calendarSurgery && (
        <CalendarSelectorSimple 
          surgery={calendarSurgery}
          onClose={() => {
            setShowCalendarSelector(false)
            setCalendarSurgery(null)
          }}
        />
      )}
    </>
  )
}

export default SurgeriesSection

