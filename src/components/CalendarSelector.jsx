import React, { useState, useEffect } from 'react'
import { Calendar, ChevronDown, Settings, Plus, Check, ExternalLink, Download } from 'lucide-react'

const CalendarSelector = ({ surgery, onClose }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [userCalendars, setUserCalendars] = useState({
    google: [],
    apple: [],
    outlook: []
  })
  const [showCalendarConfig, setShowCalendarConfig] = useState(false)

  useEffect(() => {
    // Load user's configured calendars from localStorage
    const savedCalendars = localStorage.getItem('userCalendars')
    if (savedCalendars) {
      setUserCalendars(JSON.parse(savedCalendars))
    } else {
      // Set default calendars if none configured
      setUserCalendars({
        google: [
          { id: 'primary', name: 'Personal Gmail', email: 'your.email@gmail.com', color: '#4285f4' },
          { id: 'work', name: 'Work Gmail', email: 'work.email@company.com', color: '#34a853' }
        ],
        apple: [
          { id: 'icloud', name: 'iCloud Calendar', email: 'your.email@icloud.com', color: '#007aff' },
          { id: 'exchange', name: 'Work Exchange', email: 'work.email@company.com', color: '#ff9500' }
        ],
        outlook: [
          { id: 'personal', name: 'Personal Outlook', email: 'your.email@outlook.com', color: '#0078d4' },
          { id: 'office365', name: 'Office 365', email: 'work.email@company.com', color: '#c239b3' }
        ]
      })
    }
  }, [])

  const saveCalendars = (calendars) => {
    setUserCalendars(calendars)
    localStorage.setItem('userCalendars', JSON.stringify(calendars))
  }

  const addToGoogleCalendar = (calendar) => {
    const startDate = new Date(`${surgery.surgery_date}T${surgery.surgery_time}`)
    const endDate = new Date(startDate.getTime() + (surgery.estimated_duration * 60000))
    
    const eventDetails = {
      text: `${surgery.procedure_name} - ${surgery.physician_name}`,
      dates: `${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      details: `Surgery: ${surgery.procedure_name}\\\\nPhysician: ${surgery.physician_name}\\\\nFacility: ${surgery.facility_name}\\\\nStatus: ${surgery.status}\\\\nCase Type: ${surgery.case_type}\\\\nNotes: ${surgery.notes || 'None'}`,
      location: surgery.facility_name,
      ctz: 'America/Chicago'
    }

    const params = new URLSearchParams(eventDetails)
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&${params.toString()}`
    
    // Add calendar-specific parameter if not primary
    if (calendar.id !== 'primary') {
      window.open(`${url}&src=${encodeURIComponent(calendar.email)}`, '_blank')
    } else {
      window.open(url, '_blank')
    }
  }

  const addToOutlookCalendar = (calendar) => {
    const startDate = new Date(`${surgery.surgery_date}T${surgery.surgery_time}`)
    const endDate = new Date(startDate.getTime() + (surgery.estimated_duration * 60000))
    
    const eventDetails = {
      subject: `${surgery.procedure_name} - ${surgery.physician_name}`,
      startdt: startDate.toISOString(),
      enddt: endDate.toISOString(),
      body: `Surgery: ${surgery.procedure_name}\\\\nPhysician: ${surgery.physician_name}\\\\nFacility: ${surgery.facility_name}\\\\nStatus: ${surgery.status}\\\\nCase Type: ${surgery.case_type}\\\\nNotes: ${surgery.notes || 'None'}`,
      location: surgery.facility_name
    }

    const params = new URLSearchParams(eventDetails)
    let baseUrl = 'https://outlook.live.com/calendar/0/deeplink/compose'
    
    // Use different URL for Office 365
    if (calendar.id === 'office365') {
      baseUrl = 'https://outlook.office.com/calendar/0/deeplink/compose'
    }
    
    window.open(`${baseUrl}?${params.toString()}`, '_blank')
  }

  const downloadICalFile = (calendar) => {
    const startDate = new Date(`${surgery.surgery_date}T${surgery.surgery_time}`)
    const endDate = new Date(startDate.getTime() + (surgery.estimated_duration * 60000))
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Medical Sales CRM//Surgery Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:surgery-${surgery.id || Date.now()}@medical-crm.com`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${surgery.procedure_name} - ${surgery.physician_name}`,
      `DESCRIPTION:Surgery: ${surgery.procedure_name}\\\\nPhysician: ${surgery.physician_name}\\\\nFacility: ${surgery.facility_name}\\\\nStatus: ${surgery.status}\\\\nCase Type: ${surgery.case_type}\\\\nNotes: ${surgery.notes || 'None'}`,
      `LOCATION:${surgery.facility_name}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'DESCRIPTION:Surgery Reminder',
      'ACTION:DISPLAY',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\\r\\n')

    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${surgery.procedure_name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_surgery.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const CalendarConfigModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Configure Your Calendars</h2>
            <button 
              onClick={() => setShowCalendarConfig(false)}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="text-gray-600 mb-6">
            Add your calendar accounts to ensure events are added to the correct calendar. You can add multiple accounts for each platform.
          </div>
          
          {['google', 'apple', 'outlook'].map(platform => (
            <div key={platform} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold capitalize">{platform} Calendars</h3>
                <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Calendar</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {userCalendars[platform].map((calendar, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: calendar.color }}
                      ></div>
                      <div>
                        <div className="font-medium">{calendar.name}</div>
                        <div className="text-sm text-gray-500">{calendar.email}</div>
                      </div>
                    </div>
                    <button className="text-red-600 hover:text-red-700 text-sm">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button 
              onClick={() => setShowCalendarConfig(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (showCalendarConfig) {
    return <CalendarConfigModal />
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Add to Calendar</h2>
              <p className="text-blue-100 mt-1">{surgery.procedure_name} - {surgery.physician_name}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Choose Your Calendar Platform</h3>
            <button 
              onClick={() => setShowCalendarConfig(true)}
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm"
            >
              <Settings className="h-4 w-4" />
              <span>Configure Calendars</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Google Calendar Options */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <ExternalLink className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900">Google Calendar</h4>
              </div>
              <div className="space-y-2">
                {userCalendars.google.map((calendar, index) => (
                  <button
                    key={index}
                    onClick={() => addToGoogleCalendar(calendar)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left border"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: calendar.color }}
                      ></div>
                      <div>
                        <div className="font-medium text-gray-900">{calendar.name}</div>
                        <div className="text-sm text-gray-500">{calendar.email}</div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Apple Calendar Options */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Download className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900">Apple Calendar</h4>
              </div>
              <div className="space-y-2">
                {userCalendars.apple.map((calendar, index) => (
                  <button
                    key={index}
                    onClick={() => downloadICalFile(calendar)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left border"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: calendar.color }}
                      ></div>
                      <div>
                        <div className="font-medium text-gray-900">{calendar.name}</div>
                        <div className="text-sm text-gray-500">Download .ics file for {calendar.email}</div>
                      </div>
                    </div>
                    <Download className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Outlook Calendar Options */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <ExternalLink className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900">Microsoft Outlook</h4>
              </div>
              <div className="space-y-2">
                {userCalendars.outlook.map((calendar, index) => (
                  <button
                    key={index}
                    onClick={() => addToOutlookCalendar(calendar)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left border"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: calendar.color }}
                      ></div>
                      <div>
                        <div className="font-medium text-gray-900">{calendar.name}</div>
                        <div className="text-sm text-gray-500">{calendar.email}</div>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1">Event Details Included:</div>
                <ul className="space-y-1 text-blue-700">
                  <li>• Complete surgery information and physician details</li>
                  <li>• Facility location and contact information</li>
                  <li>• 30-minute reminder before the surgery</li>
                  <li>• All notes and case requirements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarSelector

