import React, { useState, useEffect } from 'react'
import { Building2, Users, Activity, Package, TrendingUp, Calendar, MapPin, Stethoscope, FileText, Clock, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import SurgeriesSectionSimple from './SurgeriesSectionSimple'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFacilities: 0,
    totalPhysicians: 0,
    totalContacts: 0,
    totalActivities: 0,
    totalTrays: 0,
    todayAppointments: 0
  })
  
  const [recentActivities, setRecentActivities] = useState([])
  const [facilityStats, setFacilityStats] = useState([])
  const [physicianStats, setPhysicianStats] = useState([])
  const [trayStats, setTrayStats] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch facility stats
      const facilityResponse = await fetch('/api/facilities/stats')
      const facilityData = await facilityResponse.json()
      
      // Fetch physician stats
      const physicianResponse = await fetch('/api/physicians/stats')
      const physicianData = await physicianResponse.json()
      
      // Fetch appointment stats
      const appointmentResponse = await fetch('/api/appointments/stats')
      const appointmentData = await appointmentResponse.json()
      
      // Fetch activity stats
      const activityResponse = await fetch('/api/activities/stats')
      const activityData = await activityResponse.json()
      
      // Fetch tray stats
      const trayResponse = await fetch('/api/trays/stats')
      const trayData = await trayResponse.json()
      
      // Fetch recent activities
      const recentResponse = await fetch('/api/activities?per_page=5')
      const recentData = await recentResponse.json()

      // Fetch upcoming appointments
      const upcomingResponse = await fetch('/api/appointments/upcoming?limit=5')
      const upcomingData = await upcomingResponse.json()

      setStats({
        totalFacilities: facilityData.total_facilities || 0,
        totalPhysicians: physicianData.total_physicians || 0,
        totalContacts: 0, // Will be updated when we have contact stats
        totalActivities: activityData.total_activities || 0,
        totalTrays: trayData.total_trays || 0,
        todayAppointments: appointmentData.today_appointments || 0
      })

      setFacilityStats(facilityData.by_territory || [])
      setPhysicianStats(physicianData.by_specialty || [])
      setTrayStats(trayData.by_status || [])
      setRecentActivities(recentData.activities || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set mock data for demonstration
      setStats({
        totalFacilities: 388,
        totalPhysicians: 25,
        totalContacts: 1250,
        totalActivities: 156,
        totalTrays: 45,
        todayAppointments: 8
      })
      
      setFacilityStats([
        { territory: 'Wisconsin East', count: 120 },
        { territory: 'Wisconsin West', count: 95 },
        { territory: 'Illinois North', count: 85 },
        { territory: 'Illinois South', count: 88 }
      ])
      
      setPhysicianStats([
        { specialty: 'Ortho Spine', count: 12 },
        { specialty: 'Neuro', count: 8 },
        { specialty: 'Ortho', count: 3 },
        { specialty: 'Trauma', count: 2 }
      ])
      
      setTrayStats([
        { status: 'Available', count: 25 },
        { status: 'In Use', count: 15 },
        { status: 'Cleaning', count: 5 }
      ])
      
      setUpcomingAppointments([
        {
          id: 1,
          title: 'Surgery Consultation',
          physician: { full_name: 'Dr. John Smith' },
          facility: { account_name: 'Advanced Spine Center' },
          scheduled_date: '2025-08-12',
          scheduled_time: '09:00:00',
          appointment_type: 'Consultation'
        },
        {
          id: 2,
          title: 'Product Demo',
          physician: { full_name: 'Dr. Jane Doe' },
          facility: { account_name: 'Access Medical Center' },
          scheduled_date: '2025-08-13',
          scheduled_time: '14:30:00',
          appointment_type: 'Demo'
        }
      ])
      
      setRecentActivities([
        {
          id: 1,
          activity_type: 'Visit',
          subject: 'Product Demo at Advanced Spine Center',
          facility: { account_name: 'Advanced Spine Center' },
          activity_date: '2025-08-11',
          status: 'Completed'
        },
        {
          id: 2,
          activity_type: 'Call',
          subject: 'Follow-up on SI Joint procedure',
          facility: { account_name: 'Access Medical Center' },
          activity_date: '2025-08-10',
          status: 'Completed'
        }
      ])
    }
  }

  const statCards = [
    {
      title: 'Total Facilities',
      value: stats.totalFacilities,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Treating Physicians',
      value: stats.totalPhysicians,
      icon: Stethoscope,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Today\'s Appointments',
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Activities This Month',
      value: stats.totalActivities,
      icon: Activity,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Active Trays',
      value: stats.totalTrays,
      icon: Package,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ]

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Overview of your medical sales operations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Surgeries Section - At Top for Maximum Visibility */}
        <SurgeriesSectionSimple />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Facilities by Territory Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Facilities by Territory</CardTitle>
            <CardDescription>Distribution of facilities across territories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={facilityStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="territory" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tray Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Tray Status Distribution</CardTitle>
            <CardDescription>Current status of surgical trays</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trayStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {trayStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Physicians by Specialty Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Physicians by Specialty</CardTitle>
            <CardDescription>Distribution of treating physicians by specialty</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={physicianStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="specialty" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Next scheduled appointments</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-full">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.title}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Stethoscope className="h-3 w-3" />
                        <span>{appointment.physician?.full_name}</span>
                        <span>•</span>
                        <span>{new Date(appointment.scheduled_date).toLocaleDateString()}</span>
                        <span>{appointment.scheduled_time && new Date(`2000-01-01T${appointment.scheduled_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {appointment.appointment_type}
                  </Badge>
                </div>
              ))}
              {upcomingAppointments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No upcoming appointments</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest sales activities and interactions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.subject}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{activity.facility?.account_name}</span>
                      <span>•</span>
                      <span>{activity.activity_date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={activity.status === 'Completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {activity.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {activity.activity_type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2">
              <Building2 className="h-6 w-6" />
              <span>Add New Facility</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Stethoscope className="h-6 w-6" />
              <span>Add Physician</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Schedule Appointment</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Activity className="h-6 w-6" />
              <span>Log Activity</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Package className="h-6 w-6" />
              <span>Sync Trays</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards - Moved to Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard

