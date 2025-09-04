import { useState, useEffect } from 'react'
import { Search, Plus, Filter, MapPin, Phone, Mail, Calendar, Building2, Stethoscope, User } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import physiciansData from '../data/physicians.json'

// Extract unique specialties from physician data
const uniqueSpecialties = [...new Set(physiciansData.map(physician => physician.specialty))].sort()

const PhysicianList = () => {
  const [physicians, setPhysicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedAccountOwner, setSelectedAccountOwner] = useState('')
  const [stats, setStats] = useState({})

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
      const data = await response.json()
      setPhysicians(data.physicians || [])
    } catch (error) {
      console.error('Error fetching physicians:', error)
      setPhysicians([])
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
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
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
                <p className="text-2xl font-bold text-gray-900">{stats.total_physicians || 0}</p>
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
            
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Specialties</SelectItem>
                {uniqueSpecialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedAccountOwner} onValueChange={setSelectedAccountOwner}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Account Owners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Account Owners</SelectItem>
                <SelectItem value="Eric Swick">Eric Swick</SelectItem>
                <SelectItem value="Moore Medical Solutions, LLC">Moore Medical Solutions, LLC</SelectItem>
              </SelectContent>
            </Select>
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
                <Button variant="outline" size="sm" className="flex-1">
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
    </div>
  )
}

export default PhysicianList

