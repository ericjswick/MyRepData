import { useState, useEffect } from 'react'
import { Search, Plus, MapPin, Phone, Mail, Calendar, Building2, Stethoscope, User } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import PhysicianDetails from './PhysicianDetails.jsx'
import PhysicianDetailsMobile from './PhysicianDetailsMobile.jsx'
import PhysicianEditModal from './PhysicianEditModal.jsx'

const PhysicianListFixed = () => {
  const [physicians, setPhysicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedAccountOwner, setSelectedAccountOwner] = useState('')
  const [stats, setStats] = useState({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPhysicianId, setSelectedPhysicianId] = useState(null)
  const [showPhysicianDetails, setShowPhysicianDetails] = useState(false)

  useEffect(() => {
    fetchPhysicians()
    fetchStats()
  }, [])

  const fetchPhysicians = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedSpecialty) params.append('specialty', selectedSpecialty)
      if (selectedAccountOwner) params.append('account_owner', selectedAccountOwner)
      
      const response = await fetch(`/api/physicians?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPhysicians(data.physicians || [])
      } else {
        // Fallback to mock data for testing
        const mockPhysicians = [
          {
            id: 1,
            full_name: 'Dr. John Smith',
            first_name: 'John',
            last_name: 'Smith',
            npi: '1234567890',
            specialty: 'Ortho Spine',
            degree: 'MD',
            account_owner: 'Eric Swick',
            phone: '(555) 123-4567',
            email: 'john.smith@example.com',
            first_surgery_date: '2023-01-15',
            offices: [{
              city: 'Milwaukee',
              state: 'WI',
              phone: '(555) 123-4567',
              email: 'john.smith@example.com'
            }],
            affiliations: [
              { facility_name: 'Advanced Spine Center' },
              { facility_name: 'Regional Medical Center' }
            ]
          },
          {
            id: 2,
            full_name: 'Dr. Jane Doe',
            first_name: 'Jane',
            last_name: 'Doe',
            npi: '0987654321',
            specialty: 'Neuro',
            degree: 'MD',
            account_owner: 'Moore Medical Solutions, LLC',
            phone: '(555) 987-6543',
            email: 'jane.doe@example.com',
            first_surgery_date: '2022-08-20',
            offices: [{
              city: 'Madison',
              state: 'WI',
              phone: '(555) 987-6543',
              email: 'jane.doe@example.com'
            }],
            affiliations: [
              { facility_name: 'University Hospital' }
            ]
          },
          {
            id: 3,
            full_name: 'Dr. Mike Johnson',
            first_name: 'Mike',
            last_name: 'Johnson',
            npi: '1122334455',
            specialty: 'Ortho',
            degree: 'DO',
            account_owner: 'MDT Direct',
            phone: '(555) 456-7890',
            email: 'mike.johnson@example.com',
            first_surgery_date: '2023-03-10',
            offices: [{
              city: 'Chicago',
              state: 'IL',
              phone: '(555) 456-7890',
              email: 'mike.johnson@example.com'
            }],
            affiliations: [
              { facility_name: 'Chicago Medical Center' },
              { facility_name: 'Orthopedic Institute' }
            ]
          }
        ]
        setPhysicians(mockPhysicians)
      }
    } catch (error) {
      console.error('Error fetching physicians:', error)
      // Use mock data on error
      const mockPhysicians = [
        {
          id: 1,
          full_name: 'Dr. John Smith',
          first_name: 'John',
          last_name: 'Smith',
          npi: '1234567890',
          specialty: 'Ortho Spine',
          degree: 'MD',
          account_owner: 'Eric Swick',
          phone: '(555) 123-4567',
          email: 'john.smith@example.com',
          first_surgery_date: '2023-01-15',
          offices: [{
            city: 'Milwaukee',
            state: 'WI',
            phone: '(555) 123-4567',
            email: 'john.smith@example.com'
          }],
          affiliations: [
            { facility_name: 'Advanced Spine Center' },
            { facility_name: 'Regional Medical Center' }
          ]
        },
        {
          id: 2,
          full_name: 'Dr. Jane Doe',
          first_name: 'Jane',
          last_name: 'Doe',
          npi: '0987654321',
          specialty: 'Neuro',
          degree: 'MD',
          account_owner: 'Moore Medical Solutions, LLC',
          phone: '(555) 987-6543',
          email: 'jane.doe@example.com',
          first_surgery_date: '2022-08-20',
          offices: [{
            city: 'Madison',
            state: 'WI',
            phone: '(555) 987-6543',
            email: 'jane.doe@example.com'
          }],
          affiliations: [
            { facility_name: 'University Hospital' }
          ]
        }
      ]
      setPhysicians(mockPhysicians)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/physicians/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching physician stats:', error)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchPhysicians()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, selectedSpecialty, selectedAccountOwner])

  const getSpecialtyColor = (specialty) => {
    const colors = {
      'Neuro': 'bg-purple-100 text-purple-800',
      'Ortho Spine': 'bg-blue-100 text-blue-800',
      'Ortho': 'bg-green-100 text-green-800',
      'Ortho Hip': 'bg-yellow-100 text-yellow-800',
      'Trauma': 'bg-red-100 text-red-800',
      'Pain': 'bg-pink-100 text-pink-800',
      'Other': 'bg-gray-100 text-gray-800'
    }
    return colors[specialty] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const formatPhone = (phone) => {
    if (!phone) return 'N/A'
    return phone
  }

  const handleViewDetails = (physicianId) => {
    setSelectedPhysicianId(physicianId)
    setShowPhysicianDetails(true)
  }

  const handleBackToList = () => {
    setShowPhysicianDetails(false)
    setSelectedPhysicianId(null)
  }

  const handleAddPhysician = () => {
    setShowAddModal(true)
  }

  // If showing physician details, render the details component
  if (showPhysicianDetails && selectedPhysicianId) {
    const selectedPhysician = physicians.find(p => p.id === selectedPhysicianId)
    return (
      <PhysicianDetailsMobile 
        physician={selectedPhysician} 
        onBack={handleBackToList}
      />
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading physicians...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Treating Physicians</h1>
          <p className="text-gray-600">Manage your physician network and relationships</p>
        </div>
        <Button onClick={handleAddPhysician}>
          <Plus className="h-4 w-4 mr-2" />
          Add Physician
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Physicians</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_physicians || physicians.length}</p>
              </div>
              <Stethoscope className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Affiliations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_affiliations || 0}</p>
              </div>
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Specialties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.by_specialty?.length || 0}</p>
              </div>
              <User className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Account Owners</p>
                <p className="text-2xl font-bold text-gray-900">{stats.by_account_owner?.length || 0}</p>
              </div>
              <User className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search physicians by name or NPI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select 
              value={selectedSpecialty} 
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Specialties</option>
              <option value="Neuro">Neuro</option>
              <option value="Ortho Spine">Ortho Spine</option>
              <option value="Ortho">Ortho</option>
              <option value="Ortho Hip">Ortho Hip</option>
              <option value="Trauma">Trauma</option>
              <option value="Other">Other</option>
            </select>

            <select 
              value={selectedAccountOwner} 
              onChange={(e) => setSelectedAccountOwner(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Account Owners</option>
              <option value="Eric Swick">Eric Swick</option>
              <option value="Moore Medical Solutions, LLC">Moore Medical Solutions, LLC</option>
              <option value="MDT Direct">MDT Direct</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Physicians Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {physicians.map((physician) => (
          <Card key={physician.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {physician.full_name}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    NPI: {physician.npi}
                  </CardDescription>
                </div>
                <Badge className={getSpecialtyColor(physician.specialty)}>
                  {physician.specialty}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Primary Office Info */}
              {physician.offices && physician.offices.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {physician.offices[0].city}, {physician.offices[0].state}
                    </span>
                  </div>
                  
                  {physician.offices[0].phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{formatPhone(physician.offices[0].phone)}</span>
                    </div>
                  )}
                  
                  {physician.offices[0].email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{physician.offices[0].email}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Account Owner */}
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{physician.account_owner}</span>
              </div>

              {/* First Surgery Date */}
              {physician.first_surgery_date && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>First Surgery: {formatDate(physician.first_surgery_date)}</span>
                </div>
              )}

              {/* Affiliations Count */}
              {physician.affiliations && physician.affiliations.length > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{physician.affiliations.length} facility affiliation{physician.affiliations.length !== 1 ? 's' : ''}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewDetails(physician.id)}
                >
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {physicians.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No physicians found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedSpecialty || selectedAccountOwner
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first physician'}
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Physician
            </Button>
          </CardContent>
        </Card>
      )}


      {/* Add Physician Modal */}
      {showAddModal && (
        <PhysicianEditModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={(physicianData) => {
            console.log('Saving physician:', physicianData)
            setShowAddModal(false)
            fetchPhysicians() // Refresh the list
          }}
        />
      )}
    </div>
  )
}

export default PhysicianListFixed

