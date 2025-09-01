import { useState, useEffect } from 'react'
import { ArrowLeft, Edit, MapPin, Phone, Mail, Globe, Calendar, Building2, User, Stethoscope, Plus, TrendingUp, Clock, CheckCircle, AlertCircle, BarChart3, X } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'

const PhysicianDetails = ({ physicianId, onBack }) => {
  const [physician, setPhysician] = useState(null)
  const [procedures, setProcedures] = useState([])
  const [procedureStats, setProcedureStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (physicianId) {
      fetchPhysicianDetails()
      fetchPhysicianProcedures()
    }
  }, [physicianId])

  const fetchPhysicianDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/physicians/${physicianId}`)
      if (response.ok) {
        const data = await response.json()
        setPhysician(data)
      } else {
        // Fallback to mock data
        const mockPhysician = {
          id: physicianId,
          full_name: physicianId === 1 ? 'Dr. John Smith' : 'Dr. Jane Doe',
          first_name: physicianId === 1 ? 'John' : 'Jane',
          last_name: physicianId === 1 ? 'Smith' : 'Doe',
          npi: physicianId === 1 ? '1234567890' : '0987654321',
          specialty: physicianId === 1 ? 'Ortho Spine' : 'Neuro',
          degree: 'MD',
          account_owner: physicianId === 1 ? 'Eric Swick' : 'Moore Medical Solutions, LLC',
          phone: physicianId === 1 ? '(555) 123-4567' : '(555) 987-6543',
          email: physicianId === 1 ? 'john.smith@example.com' : 'jane.doe@example.com',
          mobile: physicianId === 1 ? '(555) 123-4568' : '(555) 987-6544',
          fax: physicianId === 1 ? '(555) 123-4569' : '(555) 987-6545',
          website: physicianId === 1 ? 'https://johnsmith.md' : 'https://janedoe.md',
          first_surgery_date: physicianId === 1 ? '2023-01-15' : '2022-08-20',
          notes: 'Experienced spine surgeon with excellent outcomes',
          offices: [{
            id: 1,
            office_name: physicianId === 1 ? 'Smith Spine Center' : 'Doe Neurosurgery',
            address: physicianId === 1 ? '123 Medical Drive' : '456 Hospital Blvd',
            city: physicianId === 1 ? 'Milwaukee' : 'Madison',
            state: physicianId === 1 ? 'WI' : 'WI',
            zip_code: physicianId === 1 ? '53202' : '53703',
            phone: physicianId === 1 ? '(555) 123-4567' : '(555) 987-6543',
            email: physicianId === 1 ? 'office@johnsmith.md' : 'office@janedoe.md'
          }],
          affiliations: [
            { 
              facility_name: physicianId === 1 ? 'Advanced Spine Center' : 'University Hospital',
              relationship_type: 'Primary',
              start_date: '2023-01-01'
            },
            { 
              facility_name: physicianId === 1 ? 'Regional Medical Center' : 'Madison Medical Center',
              relationship_type: 'Consulting',
              start_date: '2023-06-01'
            }
          ]
        }
        setPhysician(mockPhysician)
      }
    } catch (error) {
      console.error('Error fetching physician details:', error)
      // Use mock data on error
      const mockPhysician = {
        id: physicianId,
        full_name: physicianId === 1 ? 'Dr. John Smith' : 'Dr. Jane Doe',
        first_name: physicianId === 1 ? 'John' : 'Jane',
        last_name: physicianId === 1 ? 'Smith' : 'Doe',
        npi: physicianId === 1 ? '1234567890' : '0987654321',
        specialty: physicianId === 1 ? 'Ortho Spine' : 'Neuro',
        degree: 'MD',
        account_owner: physicianId === 1 ? 'Eric Swick' : 'Moore Medical Solutions, LLC',
        phone: physicianId === 1 ? '(555) 123-4567' : '(555) 987-6543',
        email: physicianId === 1 ? 'john.smith@example.com' : 'jane.doe@example.com',
        first_surgery_date: physicianId === 1 ? '2023-01-15' : '2022-08-20',
        offices: [{
          office_name: physicianId === 1 ? 'Smith Spine Center' : 'Doe Neurosurgery',
          city: physicianId === 1 ? 'Milwaukee' : 'Madison',
          state: 'WI'
        }],
        affiliations: [
          { facility_name: physicianId === 1 ? 'Advanced Spine Center' : 'University Hospital' }
        ]
      }
      setPhysician(mockPhysician)
    } finally {
      setLoading(false)
    }
  }

  const fetchPhysicianProcedures = async () => {
    try {
      // Fetch procedures performed by this physician
      const response = await fetch(`/api/physicians/${physicianId}/procedures`)
      if (response.ok) {
        const data = await response.json()
        setProcedures(data.procedures || [])
        setProcedureStats(data.stats || {})
      } else {
        // Fallback to mock data
        const mockProcedures = [
          {
            id: 1,
            surgery_date: '2025-08-22',
            procedure_name: 'L4-L5 Fusion',
            facility_name: 'Advanced Spine Center',
            status: 'completed',
            duration_minutes: 180,
            case_type: 'Primary',
            outcome: 'successful',
            complications: null,
            notes: 'Posterior approach with instrumentation'
          },
          {
            id: 2,
            surgery_date: '2025-08-15',
            procedure_name: 'Cervical Discectomy',
            facility_name: 'Regional Medical Center',
            status: 'completed',
            duration_minutes: 120,
            case_type: 'Revision',
            outcome: 'successful',
            complications: null,
            notes: 'C5-C6 level'
          },
          {
            id: 3,
            surgery_date: '2025-08-10',
            procedure_name: 'Lumbar Laminectomy',
            facility_name: 'Spine Surgery Center',
            status: 'completed',
            duration_minutes: 90,
            case_type: 'Primary',
            outcome: 'successful',
            complications: 'Minor bleeding',
            notes: 'L3-L4 decompression'
          },
          {
            id: 4,
            surgery_date: '2025-08-05',
            procedure_name: 'Thoracic Fusion',
            facility_name: 'Advanced Spine Center',
            status: 'completed',
            duration_minutes: 240,
            case_type: 'Primary',
            outcome: 'successful',
            complications: null,
            notes: 'T10-T12 posterior fusion'
          },
          {
            id: 5,
            surgery_date: '2025-07-28',
            procedure_name: 'L4-L5 Fusion',
            facility_name: 'Advanced Spine Center',
            status: 'completed',
            duration_minutes: 195,
            case_type: 'Primary',
            outcome: 'successful',
            complications: null,
            notes: 'Anterior approach'
          }
        ]

        const mockStats = {
          total_procedures: 15,
          success_rate: 96.7,
          average_duration: 165,
          most_common_procedure: 'L4-L5 Fusion',
          procedures_this_month: 3,
          procedures_last_month: 4,
          complication_rate: 3.3,
          procedure_types: {
            'L4-L5 Fusion': 6,
            'Cervical Discectomy': 4,
            'Lumbar Laminectomy': 3,
            'Thoracic Fusion': 2
          }
        }

        setProcedures(mockProcedures)
        setProcedureStats(mockStats)
      }
    } catch (error) {
      console.error('Error fetching physician procedures:', error)
    }
  }

  const getSpecialtyColor = (specialty) => {
    const colors = {
      'Neuro': 'bg-purple-100 text-purple-800',
      'Ortho Spine': 'bg-blue-100 text-blue-800',
      'Ortho': 'bg-green-100 text-green-800',
      'Ortho Hip': 'bg-yellow-100 text-yellow-800',
      'Trauma': 'bg-red-100 text-red-800',
      'Other': 'bg-gray-100 text-gray-800'
    }
    return colors[specialty] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading physician details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!physician) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-600">Physician not found</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Physicians
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{physician.full_name}</h1>
            <p className="text-gray-600">NPI: {physician.npi}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getSpecialtyColor(physician.specialty)}>
            {physician.specialty}
          </Badge>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
          <TabsTrigger value="trays">Trays</TabsTrigger>
          <TabsTrigger value="offices">Offices</TabsTrigger>
          <TabsTrigger value="affiliations">Affiliations</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-900">{physician.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">NPI</label>
                    <p className="text-gray-900">{physician.npi}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Specialty</label>
                    <p className="text-gray-900">{physician.specialty}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Account Owner</label>
                    <p className="text-gray-900">{physician.account_owner}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">First Surgery Date</label>
                    <p className="text-gray-900">{formatDate(physician.first_surgery_date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <Badge variant={physician.is_active ? "default" : "secondary"}>
                      {physician.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                
                {physician.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Notes</label>
                    <p className="text-gray-900 mt-1">{physician.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Offices</span>
                  </div>
                  <span className="font-semibold">{physician.offices?.length || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Affiliations</span>
                  </div>
                  <span className="font-semibold">{physician.affiliations?.length || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Years Active</span>
                  </div>
                  <span className="font-semibold">
                    {physician.first_surgery_date 
                      ? new Date().getFullYear() - new Date(physician.first_surgery_date).getFullYear()
                      : 'N/A'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="procedures" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Procedures Performed</h3>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Procedure
            </Button>
          </div>

          {/* Procedure Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Procedures</p>
                    <p className="text-3xl font-bold text-gray-900">{procedureStats.total_procedures || 0}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Stethoscope className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-3xl font-bold text-green-600">{procedureStats.success_rate || 0}%</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                    <p className="text-3xl font-bold text-purple-600">{procedureStats.average_duration || 0}m</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-3xl font-bold text-orange-600">{procedureStats.procedures_this_month || 0}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Procedure Types Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Procedure Types
                </CardTitle>
                <CardDescription>Distribution of procedures performed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(procedureStats.procedure_types || {}).map(([procedure, count]) => (
                    <div key={procedure} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-900">{procedure}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / Math.max(...Object.values(procedureStats.procedure_types || {}))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Success Rate</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{procedureStats.success_rate || 0}%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-gray-900">Complication Rate</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">{procedureStats.complication_rate || 0}%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Most Common</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">{procedureStats.most_common_procedure || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">Avg Duration</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{procedureStats.average_duration || 0} min</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Procedures */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Procedures</CardTitle>
              <CardDescription>Latest surgical procedures performed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {procedures.map((procedure) => (
                  <div key={procedure.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{procedure.procedure_name}</h4>
                          <Badge 
                            variant={procedure.outcome === 'successful' ? 'default' : 'destructive'}
                            className={procedure.outcome === 'successful' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {procedure.outcome}
                          </Badge>
                          <Badge variant="outline">{procedure.case_type}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(procedure.surgery_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span>{procedure.facility_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{procedure.duration_minutes} minutes</span>
                          </div>
                        </div>

                        {procedure.complications && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-medium text-yellow-800">Complications:</span>
                              <span className="text-sm text-yellow-700">{procedure.complications}</span>
                            </div>
                          </div>
                        )}

                        {procedure.notes && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-gray-700">Notes: </span>
                            <span className="text-sm text-gray-600">{procedure.notes}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {procedures.length === 0 && (
                <div className="text-center py-12">
                  <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No procedures found</h3>
                  <p className="text-gray-600 mb-4">Procedure history will appear here</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Procedure
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trays" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Physician Tray Preferences</h3>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Tray Preference
            </Button>
          </div>

          {/* Tray Preferences by Procedure */}
          <div className="space-y-6">
            {/* Mock tray preferences data */}
            {[
              {
                procedure: 'L4-L5 Fusion',
                trays: [
                  { name: 'SI Bone Fusion Tray A', required: true, notes: 'Primary tray for all L4-L5 cases' },
                  { name: 'SI Bone Fusion Tray B', required: false, notes: 'Backup tray for complex cases' },
                  { name: 'Instrumentation Tray', required: true, notes: 'Standard instrumentation' }
                ]
              },
              {
                procedure: 'Cervical Discectomy',
                trays: [
                  { name: 'Cervical Tray Standard', required: true, notes: 'Standard cervical approach' },
                  { name: 'Microsurgery Tray', required: false, notes: 'For microscopic procedures' }
                ]
              },
              {
                procedure: 'Lumbar Laminectomy',
                trays: [
                  { name: 'Lumbar Decompression Tray', required: true, notes: 'Standard decompression' },
                  { name: 'Bone Graft Tray', required: false, notes: 'When fusion is needed' }
                ]
              }
            ].map((procedureData, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{procedureData.procedure}</CardTitle>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Preferences
                    </Button>
                  </div>
                  <CardDescription>
                    Tray preferences for {procedureData.procedure} procedures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {procedureData.trays.map((tray, trayIndex) => (
                      <div key={trayIndex} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${tray.required ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                            <h4 className="font-medium text-gray-900">{tray.name}</h4>
                            <Badge variant={tray.required ? "destructive" : "secondary"}>
                              {tray.required ? 'Required' : 'Optional'}
                            </Badge>
                          </div>
                          {tray.notes && (
                            <p className="text-sm text-gray-600 mt-2 ml-6">{tray.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Tray to {procedureData.procedure}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* TrayTracker Integration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                TrayTracker Integration
              </CardTitle>
              <CardDescription>
                Real-time tray tracking and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Connection Status</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Tracked Trays</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">8</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-900">Last Sync</span>
                  </div>
                  <span className="text-sm font-medium text-yellow-600">2 minutes ago</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  View Tray Locations in TrayTracker
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Empty State for New Physicians */}
          {false && (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tray preferences set</h3>
                <p className="text-gray-600 mb-4">
                  Set up tray preferences for this physician's procedures to ensure proper surgical preparation
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Tray Preference
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="offices" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Practice Offices</h3>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Office
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {physician.offices?.map((office) => (
              <Card key={office.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {office.office_name || `${physician.full_name} - ${office.city}`}
                    </CardTitle>
                    {office.is_primary_office && (
                      <Badge variant="default">Primary</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900">{office.address_line_1}</p>
                      {office.address_line_2 && (
                        <p className="text-gray-900">{office.address_line_2}</p>
                      )}
                      <p className="text-gray-900">
                        {office.city}, {office.state} {office.zip_code}
                      </p>
                    </div>
                  </div>

                  {office.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">{office.phone}</span>
                    </div>
                  )}

                  {office.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900">{office.email}</span>
                    </div>
                  )}

                  {office.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-600" />
                      <a 
                        href={office.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {office.website}
                      </a>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Set Primary
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {(!physician.offices || physician.offices.length === 0) && (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No offices found</h3>
                <p className="text-gray-600 mb-4">Add practice offices for this physician</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Office
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="affiliations" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Facility Affiliations</h3>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Affiliation
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {physician.affiliations?.map((affiliation) => (
              <Card key={affiliation.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {affiliation.facility?.account_name}
                  </CardTitle>
                  <CardDescription>
                    {affiliation.facility?.shipping_city}, {affiliation.facility?.shipping_state}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Affiliation Type</span>
                    <Badge variant="outline">{affiliation.affiliation_type}</Badge>
                  </div>

                  {affiliation.start_date && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Start Date</span>
                      <span className="text-sm text-gray-900">{formatDate(affiliation.start_date)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge variant={affiliation.is_active ? "default" : "secondary"}>
                      {affiliation.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {affiliation.notes && (
                    <div>
                      <span className="text-sm text-gray-600">Notes</span>
                      <p className="text-sm text-gray-900 mt-1">{affiliation.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Facility
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {(!physician.affiliations || physician.affiliations.length === 0) && (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No affiliations found</h3>
                <p className="text-gray-600 mb-4">Add facility affiliations for this physician</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Affiliation
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-600">Activity history will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PhysicianDetails

