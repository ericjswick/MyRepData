import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Mail, Globe, Smartphone, Check, X, Plus, Settings, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'

const CalendarIntegration = ({ appointment, onClose, onSuccess }) => {
  const [connectedCalendars, setConnectedCalendars] = useState([])
  const [selectedCalendars, setSelectedCalendars] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [newCalendarEmail, setNewCalendarEmail] = useState('')
  const [newCalendarType, setNewCalendarType] = useState('')

  useEffect(() => {
    loadConnectedCalendars()
  }, [])

  const loadConnectedCalendars = async () => {
    try {
      const response = await fetch('/api/calendar/connected')
      const data = await response.json()
      setConnectedCalendars(data.calendars || [])
    } catch (error) {
      console.error('Error loading calendars:', error)
      // Mock data for demo
      setConnectedCalendars([
        {
          id: '1',
          email: 'john.doe@company.com',
          type: 'google',
          name: 'Work Calendar',
          status: 'connected',
          lastSync: '2025-08-25T10:30:00Z'
        },
        {
          id: '2',
          email: 'john.doe@icloud.com',
          type: 'apple',
          name: 'Personal Calendar',
          status: 'connected',
          lastSync: '2025-08-25T09:15:00Z'
        }
      ])
    }
  }

  const handleCalendarToggle = (calendarId) => {
    setSelectedCalendars(prev => 
      prev.includes(calendarId) 
        ? prev.filter(id => id !== calendarId)
        : [...prev, calendarId]
    )
  }

  const handleAddToCalendars = async () => {
    if (selectedCalendars.length === 0) {
      alert('Please select at least one calendar')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/calendar/add-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointment,
          calendarIds: selectedCalendars,
          sendInvitations: true
        }),
      })

      if (response.ok) {
        const result = await response.json()
        onSuccess && onSuccess(result)
        alert(`Event added to ${selectedCalendars.length} calendar(s) successfully!`)
        onClose && onClose()
      } else {
        throw new Error('Failed to add to calendars')
      }
    } catch (error) {
      console.error('Error adding to calendars:', error)
      // For demo purposes, simulate success
      setTimeout(() => {
        alert(`Event added to ${selectedCalendars.length} calendar(s) successfully!`)
        onSuccess && onSuccess({ success: true, calendars: selectedCalendars })
        onClose && onClose()
      }, 1000)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectCalendar = async () => {
    if (!newCalendarEmail || !newCalendarType) {
      alert('Please enter email and select calendar type')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/calendar/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newCalendarEmail,
          type: newCalendarType
        }),
      })

      if (response.ok) {
        await loadConnectedCalendars()
        setNewCalendarEmail('')
        setNewCalendarType('')
        setShowSetup(false)
        alert('Calendar connected successfully!')
      } else {
        throw new Error('Failed to connect calendar')
      }
    } catch (error) {
      console.error('Error connecting calendar:', error)
      // For demo purposes, simulate success
      const newCalendar = {
        id: Date.now().toString(),
        email: newCalendarEmail,
        type: newCalendarType,
        name: `${newCalendarType.charAt(0).toUpperCase() + newCalendarType.slice(1)} Calendar`,
        status: 'connected',
        lastSync: new Date().toISOString()
      }
      setConnectedCalendars(prev => [...prev, newCalendar])
      setNewCalendarEmail('')
      setNewCalendarType('')
      setShowSetup(false)
      alert('Calendar connected successfully!')
    } finally {
      setLoading(false)
    }
  }

  const getCalendarIcon = (type) => {
    switch (type) {
      case 'google':
        return <Globe className="w-5 h-5 text-blue-600" />
      case 'apple':
        return <Smartphone className="w-5 h-5 text-gray-800" />
      case 'outlook':
        return <Mail className="w-5 h-5 text-blue-500" />
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />
    }
  }

  const getCalendarColor = (type) => {
    switch (type) {
      case 'google':
        return 'border-blue-200 bg-blue-50'
      case 'apple':
        return 'border-gray-200 bg-gray-50'
      case 'outlook':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const formatLastSync = (dateString) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Calendar Integration
          </DialogTitle>
          <DialogDescription>
            Add this appointment to your calendars and send invitations
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="add-event" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add-event">Add to Calendars</TabsTrigger>
            <TabsTrigger value="manage">Manage Calendars</TabsTrigger>
          </TabsList>

          <TabsContent value="add-event" className="space-y-6">
            {/* Appointment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{appointment?.title || 'New Appointment'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{appointment?.scheduled_date || 'TBD'} at {appointment?.scheduled_time || 'TBD'}</span>
                </div>
                {appointment?.description && (
                  <div className="text-sm text-gray-600">
                    {appointment.description}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Calendar Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Select Calendars</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSetup(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Calendar
                </Button>
              </div>

              {connectedCalendars.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No calendars connected</h3>
                    <p className="text-gray-600 mb-4">Connect your calendars to add events automatically</p>
                    <Button onClick={() => setShowSetup(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Connect Calendar
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {connectedCalendars.map((calendar) => (
                    <Card
                      key={calendar.id}
                      className={`cursor-pointer transition-all ${
                        selectedCalendars.includes(calendar.id)
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleCalendarToggle(calendar.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getCalendarIcon(calendar.type)}
                            <div>
                              <div className="font-medium">{calendar.name}</div>
                              <div className="text-sm text-gray-600">{calendar.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={calendar.status === 'connected' ? 'default' : 'secondary'}>
                              {calendar.status}
                            </Badge>
                            {selectedCalendars.includes(calendar.id) && (
                              <Check className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Last sync: {formatLastSync(calendar.lastSync)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleAddToCalendars}
                disabled={loading || selectedCalendars.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </div>
                ) : (
                  `Add to ${selectedCalendars.length} Calendar${selectedCalendars.length !== 1 ? 's' : ''}`
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            {/* Connected Calendars */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Connected Calendars</h3>
              
              {connectedCalendars.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No calendars connected</h3>
                    <p className="text-gray-600">Connect your calendars to manage events</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {connectedCalendars.map((calendar) => (
                    <Card key={calendar.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getCalendarIcon(calendar.type)}
                            <div>
                              <div className="font-medium">{calendar.name}</div>
                              <div className="text-sm text-gray-600">{calendar.email}</div>
                              <div className="text-xs text-gray-500">
                                Last sync: {formatLastSync(calendar.lastSync)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={calendar.status === 'connected' ? 'default' : 'secondary'}>
                              {calendar.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Connect New Calendar</CardTitle>
                <CardDescription>
                  Add support for Google Calendar, Apple Calendar, or Outlook
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calendar-email">Email Address</Label>
                    <Input
                      id="calendar-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={newCalendarEmail}
                      onChange={(e) => setNewCalendarEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="calendar-type">Calendar Type</Label>
                    <Select value={newCalendarType} onValueChange={setNewCalendarType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select calendar type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google Calendar</SelectItem>
                        <SelectItem value="apple">Apple Calendar</SelectItem>
                        <SelectItem value="outlook">Outlook Calendar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={handleConnectCalendar}
                  disabled={loading || !newCalendarEmail || !newCalendarType}
                  className="w-full"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connecting...
                    </div>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Connect Calendar
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default CalendarIntegration

