import { useState, useEffect } from 'react'
import { ArrowLeft, Edit, User, Phone, Mail, MapPin, Calendar, Building2, Activity, Package, Stethoscope, Plus, Save, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'

function PhysicianDetailsMobile({ physician, onBack }) {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Tray editing state
  const [trayPreferences, setTrayPreferences] = useState([])
  const [editingCaseType, setEditingCaseType] = useState(null)
  const [editingTray, setEditingTray] = useState(null)
  const [showAddCaseTypeModal, setShowAddCaseTypeModal] = useState(false)
  const [showEditTrayModal, setShowEditTrayModal] = useState(false)
  const [showAddTrayModal, setShowAddTrayModal] = useState(false)
  
  // Available case types
  const availableCaseTypes = [
    'SI fusion – lateral',
    'SI fusion – Intra–articular',
    'SI fusion – Oblique/Postero lateral',
    'SI fusion – Medial to lateral',
    'Spine fusion – Long Construct',
    'Spine fusion – Short construct',
    'Sacral fracture – TNT/TORQ'
  ]

  // Initialize tray preferences
  useEffect(() => {
    const initialTrayPreferences = [
      {
        caseType: 'SI fusion – lateral',
        trays: [
          { 
            id: 'si_fusion_lateral_primary',
            name: 'SI fusion – lateral Primary Tray', 
            required: true, 
            notes: 'Primary tray for all SI fusion – lateral cases',
            status: 'available'
          },
          { 
            id: 'si_fusion_lateral_backup',
            name: 'SI fusion – lateral Backup Tray', 
            required: false, 
            notes: 'Backup tray for complex SI fusion – lateral cases',
            status: 'available'
          }
        ]
      },
      {
        caseType: 'SI fusion – Intra–articular',
        trays: [
          { 
            id: 'si_fusion_intra_articular_primary',
            name: 'SI fusion – Intra–articular Primary Tray', 
            required: true, 
            notes: 'Primary tray for SI fusion – Intra–articular procedures',
            status: 'in_use'
          },
          { 
            id: 'si_fusion_intra_articular_backup',
            name: 'SI fusion – Intra–articular Backup Tray', 
            required: false, 
            notes: 'Backup tray for SI fusion – Intra–articular procedures',
            status: 'available'
          }
        ]
      },
      {
        caseType: 'Spine fusion – Long Construct',
        trays: [
          { 
            id: 'spine_fusion_long_construct_primary',
            name: 'Spine fusion – Long Construct Primary Tray', 
            required: true, 
            notes: 'Primary tray for long construct spine fusion',
            status: 'maintenance'
          },
          { 
            id: 'spine_fusion_long_construct_backup',
            name: 'Spine fusion – Long Construct Backup Tray', 
            required: false, 
            notes: 'Backup tray for long construct spine fusion',
            status: 'available'
          }
        ]
      },
      {
        caseType: 'Sacral fracture – TNT/TORQ',
        trays: [
          { 
            id: 'sacral_fracture_tnt_torq_primary',
            name: 'Sacral fracture – TNT/TORQ Primary Tray', 
            required: true, 
            notes: 'Primary tray for sacral fracture TNT/TORQ procedures',
            status: 'available'
          },
          { 
            id: 'sacral_fracture_tnt_torq_backup',
            name: 'Sacral fracture – TNT/TORQ Backup Tray', 
            required: false, 
            notes: 'Backup tray for sacral fracture TNT/TORQ procedures',
            status: 'cleaning'
          }
        ]
      }
    ]
    setTrayPreferences(initialTrayPreferences)
  }, [])

  // Tray editing functions
  const handleEditCaseType = (caseType) => {
    setEditingCaseType(caseType)
  }

  const handleEditTray = (caseType, tray) => {
    setEditingCaseType(caseType)
    setEditingTray(tray)
    setShowEditTrayModal(true)
  }

  const handleAddTray = (caseType) => {
    setEditingCaseType(caseType)
    setEditingTray({
      id: '',
      name: '',
      required: false,
      notes: '',
      status: 'available'
    })
    setShowAddTrayModal(true)
  }

  const handleSaveTray = (updatedTray) => {
    const updatedPreferences = trayPreferences.map(caseTypeData => 
      caseTypeData.caseType === editingCaseType
        ? {
            ...caseTypeData,
            trays: caseTypeData.trays.map(tray => 
              tray.id === updatedTray.id ? { ...updatedTray, updatedAt: new Date().toISOString() } : tray
            )
          }
        : caseTypeData
    )
    
    try {
      // Save to localStorage for persistence
      localStorage.setItem('trayPreferences', JSON.stringify(updatedPreferences))
      
      // Update local state
      setTrayPreferences(updatedPreferences)
      setShowEditTrayModal(false)
      setEditingTray(null)
      
      alert(`Tray "${updatedTray.name}" updated successfully!`)
    } catch (error) {
      console.error('Error saving tray:', error)
      alert('Error saving tray. Please try again.')
    }
  }

  const handleAddNewTray = (newTray) => {
    const trayId = newTray.name.toLowerCase().replace(/[^a-z0-9]/g, '_')
    const trayWithId = { 
      ...newTray, 
      id: trayId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const updatedPreferences = trayPreferences.map(caseTypeData => 
      caseTypeData.caseType === editingCaseType
        ? {
            ...caseTypeData,
            trays: [...caseTypeData.trays, trayWithId]
          }
        : caseTypeData
    )
    
    try {
      // Save to localStorage for persistence
      localStorage.setItem('trayPreferences', JSON.stringify(updatedPreferences))
      
      // Update local state
      setTrayPreferences(updatedPreferences)
      setShowAddTrayModal(false)
      setEditingTray(null)
      
      alert(`Tray "${newTray.name}" added successfully!`)
    } catch (error) {
      console.error('Error adding tray:', error)
      alert('Error adding tray. Please try again.')
    }
  }

  const handleRemoveTray = (caseType, trayId) => {
    setTrayPreferences(prev => 
      prev.map(caseTypeData => 
        caseTypeData.caseType === caseType
          ? {
              ...caseTypeData,
              trays: caseTypeData.trays.filter(tray => tray.id !== trayId)
            }
          : caseTypeData
      )
    )
  }

  const handleAddCaseType = (newCaseType) => {
    const primaryTray = {
      id: `${newCaseType.toLowerCase().replace(/[^a-z0-9]/g, '_')}_primary`,
      name: `${newCaseType} Primary Tray`,
      required: true,
      notes: `Primary tray for ${newCaseType} procedures`,
      status: 'available'
    }
    
    const backupTray = {
      id: `${newCaseType.toLowerCase().replace(/[^a-z0-9]/g, '_')}_backup`,
      name: `${newCaseType} Backup Tray`,
      required: false,
      notes: `Backup tray for ${newCaseType} procedures`,
      status: 'available'
    }

    setTrayPreferences(prev => [
      ...prev,
      {
        caseType: newCaseType,
        trays: [primaryTray, backupTray]
      }
    ])
    setShowAddCaseTypeModal(false)
  }

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
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Tray Preferences</h3>
              <Dialog open={showAddCaseTypeModal} onOpenChange={setShowAddCaseTypeModal}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Case Type
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Case Type Preference</DialogTitle>
                    <DialogDescription>
                      Select a case type to configure tray preferences for this physician.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="caseType">Case Type</Label>
                      <Select onValueChange={(value) => handleAddCaseType(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a case type" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCaseTypes
                            .filter(caseType => !trayPreferences.some(pref => pref.caseType === caseType))
                            .map((caseType) => (
                              <SelectItem key={caseType} value={caseType}>
                                {caseType}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Tray Preferences by Case Type */}
            {trayPreferences.map((caseTypeData, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{caseTypeData.caseType}</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditCaseType(caseTypeData.caseType)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <CardDescription className="text-sm">
                    Tray requirements for {caseTypeData.caseType}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {caseTypeData.trays.map((tray, trayIndex) => (
                    <div key={trayIndex} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${tray.required ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                            <p className="font-medium text-sm text-gray-900">{tray.name}</p>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={tray.required ? "destructive" : "secondary"} className="text-xs">
                              {tray.required ? 'Required' : 'Optional'}
                            </Badge>
                            <Badge 
                              className={`text-xs ${
                                tray.status === 'available' ? 'bg-green-100 text-green-800' :
                                tray.status === 'in_use' ? 'bg-yellow-100 text-yellow-800' :
                                tray.status === 'cleaning' ? 'bg-blue-100 text-blue-800' :
                                tray.status === 'maintenance' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {tray.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          {tray.notes && (
                            <p className="text-xs text-gray-600">{tray.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditTray(caseTypeData.caseType, tray)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                            onClick={() => handleRemoveTray(caseTypeData.caseType, tray.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => handleAddTray(caseTypeData.caseType)}
                  >
                    <Plus className="w-3 h-3 mr-2" />
                    Add Tray
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Empty State */}
            {trayPreferences.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tray preferences set</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Set up tray preferences for this physician's procedures
                  </p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowAddCaseTypeModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Preference
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* TrayTracker Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">TrayTracker Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Connection Status</p>
                      <p className="text-xs text-gray-600">Last sync: 2 minutes ago</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Tracked Trays</p>
                      <p className="text-xs text-gray-600">Real-time monitoring</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">8 Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Tray Modal */}
            <Dialog open={showEditTrayModal} onOpenChange={setShowEditTrayModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Tray Details</DialogTitle>
                  <DialogDescription>
                    Modify the tray configuration for {editingCaseType}
                  </DialogDescription>
                </DialogHeader>
                {editingTray && (
                  <TrayEditFormMobile
                    tray={editingTray}
                    onSave={handleSaveTray}
                    onCancel={() => setShowEditTrayModal(false)}
                  />
                )}
              </DialogContent>
            </Dialog>

            {/* Add Tray Modal */}
            <Dialog open={showAddTrayModal} onOpenChange={setShowAddTrayModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Tray</DialogTitle>
                  <DialogDescription>
                    Add a new tray configuration for {editingCaseType}
                  </DialogDescription>
                </DialogHeader>
                {editingTray && (
                  <TrayEditFormMobile
                    tray={editingTray}
                    onSave={handleAddNewTray}
                    onCancel={() => setShowAddTrayModal(false)}
                    isNew={true}
                  />
                )}
              </DialogContent>
            </Dialog>
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

// TrayEditFormMobile Component
const TrayEditFormMobile = ({ tray, onSave, onCancel, isNew = false }) => {
  const [formData, setFormData] = useState({
    name: tray.name || '',
    required: tray.required || false,
    notes: tray.notes || '',
    status: tray.status || 'available'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...tray,
      ...formData
    })
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="trayName" className="text-sm">Tray Name</Label>
        <Input
          id="trayName"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter tray name"
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="required" className="text-sm">Requirement Level</Label>
        <Select 
          value={formData.required ? 'required' : 'optional'} 
          onValueChange={(value) => handleChange('required', value === 'required')}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="required">Required</SelectItem>
            <SelectItem value="optional">Optional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status" className="text-sm">Tray Status</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleChange('status', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="in_use">In Use</SelectItem>
            <SelectItem value="cleaning">Cleaning</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes" className="text-sm">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Enter any notes about this tray"
          rows={3}
          className="mt-1"
        />
      </div>

      <DialogFooter className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex-1">
          <Save className="w-4 h-4 mr-2" />
          {isNew ? 'Add Tray' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default PhysicianDetailsMobile

