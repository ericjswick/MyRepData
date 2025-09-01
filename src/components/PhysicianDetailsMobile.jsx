import { useState } from 'react'
import { ArrowLeft, Edit, User, Phone, Mail, MapPin, Calendar, Building2, Activity, Package, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'

function PhysicianDetailsMobile({ physician, onBack }) {
  const [activeTab, setActiveTab] = useState('overview')

  // Map physician data to expected format
  const physicianData = physician ? {
    id: physician.id,
    name: physician.full_name || physician.name || 'Unknown Physician',
    npi: physician.npi || 'N/A',
    specialty: physician.specialty || 'N/A',
    accountOwner: physician.account_owner || 'N/A',
    firstSurgery: physician.first_surgery_date || 'N/A',
    status: physician.status || 'Active',
    phone: physician.phone || 'N/A',
    email: physician.email || 'N/A',
    location: physician.offices && physician.offices[0] ? 
      `${physician.offices[0].city}, ${physician.offices[0].state}` : 'N/A',
    offices: physician.offices ? physician.offices.length : 0,
    affiliations: physician.affiliations ? physician.affiliations.length : 0,
    yearsActive: physician.first_surgery_date ? 
      new Date().getFullYear() - new Date(physician.first_surgery_date).getFullYear() : 0
  } : {
    id: 1,
    name: 'Dr. John Smith',
    npi: '1234567890',
    specialty: 'Ortho Spine',
    accountOwner: 'Eric Swick',
    firstSurgery: '1/15/2023',
    status: 'Active',
    phone: '(555) 123-4567',
    email: 'john.smith@example.com',
    location: 'Milwaukee, WI',
    offices: 2,
    affiliations: 1,
    yearsActive: 2
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'procedures', label: 'Procedures', icon: Stethoscope },
    { id: 'trays', label: 'Trays', icon: Package },
    { id: 'activity', label: 'Activity', icon: Activity }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-base font-semibold text-gray-900">{physicianData.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">NPI</label>
                    <p className="text-base text-gray-900">{physicianData.npi}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Specialty</label>
                    <Badge className="bg-blue-100 text-blue-800">{physicianData.specialty}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Account Owner</label>
                    <p className="text-base text-gray-900">{physicianData.accountOwner}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-base text-gray-900">{physicianData.phone}</p>
                    <p className="text-sm text-gray-600">Primary Phone</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-base text-gray-900">{physicianData.email}</p>
                    <p className="text-sm text-gray-600">Email Address</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-base text-gray-900">{physicianData.location}</p>
                    <p className="text-sm text-gray-600">Primary Location</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{physicianData.offices}</p>
                    <p className="text-sm text-gray-600">Offices</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{physicianData.affiliations}</p>
                    <p className="text-sm text-gray-600">Affiliations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'procedures':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Procedure Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">24</p>
                    <p className="text-sm text-gray-600">Total Procedures</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">96%</p>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Procedures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">L4-L5 Fusion</h4>
                  <p className="text-sm text-gray-600">Advanced Spine Center • Aug 15, 2025</p>
                  <Badge className="bg-green-100 text-green-800 text-xs mt-1">Completed</Badge>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Cervical Discectomy</h4>
                  <p className="text-sm text-gray-600">Regional Medical Center • Aug 10, 2025</p>
                  <Badge className="bg-green-100 text-green-800 text-xs mt-1">Completed</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'trays':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tray Preferences</CardTitle>
                <CardDescription>Procedure-specific tray requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* L4-L5 Fusion */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">L4-L5 Fusion</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">SI Bone Fusion Tray A</p>
                          <p className="text-sm text-gray-600">Primary tray for all L4-L5 cases</p>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 text-xs">Required</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">SI Bone Fusion Tray B</p>
                          <p className="text-sm text-gray-600">Backup tray for complex cases</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">Optional</Badge>
                    </div>
                  </div>
                </div>

                {/* Cervical Discectomy */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Cervical Discectomy</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">Cervical Tray Standard</p>
                          <p className="text-sm text-gray-600">Standard cervical approach</p>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 text-xs">Required</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">TrayTracker Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Connection Status</p>
                    <p className="text-sm text-gray-600">Last sync: 2 minutes ago</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'activity':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent activity</p>
                  <p className="text-sm text-gray-500">Activity history will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 px-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{physicianData.name}</h1>
          <p className="text-gray-600">NPI: {physicianData.npi}</p>
          <Badge className="bg-blue-100 text-blue-800 mt-2">{physicianData.specialty}</Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 sticky top-[120px] z-10">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default PhysicianDetailsMobile

