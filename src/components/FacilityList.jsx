import { useState, useEffect } from 'react'
import { Search, Plus, Filter, MapPin, Phone, Mail, Building2, Users, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'

const FacilityList = () => {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTerritory, setSelectedTerritory] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchFacilities()
  }, [currentPage, searchTerm, selectedTerritory, selectedSpecialty, selectedType])

  const fetchFacilities = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage,
        per_page: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedTerritory && { territory: selectedTerritory }),
        ...(selectedSpecialty && { specialty: selectedSpecialty }),
        ...(selectedType && { account_type: selectedType })
      })

      const response = await fetch(`/api/facilities?${params}`)
      const data = await response.json()
      
      setFacilities(data.facilities || [])
      setTotalPages(data.pages || 1)
    } catch (error) {
      console.error('Error fetching facilities:', error)
      // Mock data for demonstration
      setFacilities([
        {
          id: 1,
          account_name: 'Advanced Spine Center',
          account_record_type: 'ASC',
          specialty: 'Ortho',
          territory: 'Wisconsin East',
          account_owner: 'Eric Swick',
          shipping_city: 'Neenah',
          shipping_state: 'WI',
          phone: '(920) 215-3603',
          surgeon_email: 'aawad@mcw.edu',
          website: 'http://ascofwi.com/contact/'
        },
        {
          id: 2,
          account_name: 'Access Medical Center',
          account_record_type: 'ASC',
          specialty: 'Ortho',
          territory: 'Wisconsin East',
          account_owner: 'Eric Swick',
          shipping_city: 'Racine',
          shipping_state: 'WI',
          phone: '(888) 901-7246',
          website: 'www.apmhealth.com/'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleFilterChange = (type, value) => {
    switch (type) {
      case 'territory':
        setSelectedTerritory(value)
        break
      case 'specialty':
        setSelectedSpecialty(value)
        break
      case 'type':
        setSelectedType(value)
        break
    }
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTerritory('')
    setSelectedSpecialty('')
    setSelectedType('')
    setCurrentPage(1)
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'ASC':
        return 'bg-blue-100 text-blue-800'
      case 'Hospital':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Facilities</h2>
          <p className="text-gray-600">Manage your medical facilities and surgical centers</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Facility</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search facilities by name, city, or state..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={selectedTerritory} onValueChange={(value) => handleFilterChange('territory', value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Territory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Territories</SelectItem>
                  <SelectItem value="Wisconsin East">Wisconsin East</SelectItem>
                  <SelectItem value="Wisconsin West">Wisconsin West</SelectItem>
                  <SelectItem value="Illinois North">Illinois North</SelectItem>
                  <SelectItem value="Illinois South">Illinois South</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSpecialty} onValueChange={(value) => handleFilterChange('specialty', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Specialties</SelectItem>
                  <SelectItem value="Ortho">Ortho</SelectItem>
                  <SelectItem value="Neuro">Neuro</SelectItem>
                  <SelectItem value="Spine">Spine</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="ASC">ASC</SelectItem>
                  <SelectItem value="Hospital">Hospital</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facilities Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <Card key={facility.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                        {facility.account_name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {facility.account_owner}
                      </p>
                    </div>
                    <Badge className={`text-xs ${getTypeColor(facility.account_record_type)}`}>
                      {facility.account_record_type}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{facility.shipping_city}, {facility.shipping_state}</span>
                    </div>
                    
                    {facility.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{facility.phone}</span>
                      </div>
                    )}
                    
                    {facility.surgeon_email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{facility.surgeon_email}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {facility.specialty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {facility.territory}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center text-xs text-gray-500">
                      <Building2 className="h-3 w-3 mr-1" />
                      <span>ID: {facility.id}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Users className="h-3 w-3 mr-1" />
                        Contacts
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && facilities.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedTerritory || selectedSpecialty || selectedType
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by adding your first facility.'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FacilityList

