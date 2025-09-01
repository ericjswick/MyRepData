import { useState, useEffect } from 'react'
import { Search, Plus, Filter, MapPin, Phone, Mail, Building2, Users, Eye } from 'lucide-react'

const FacilityListFixed = () => {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTerritory, setSelectedTerritory] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFacilityDetails, setShowFacilityDetails] = useState(false)
  const [selectedFacilityId, setSelectedFacilityId] = useState(null)

  useEffect(() => {
    fetchFacilities()
  }, [searchTerm, selectedTerritory, selectedSpecialty, selectedType])

  const fetchFacilities = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: 1,
        per_page: 50,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedTerritory && { territory: selectedTerritory }),
        ...(selectedSpecialty && { specialty: selectedSpecialty }),
        ...(selectedType && { account_type: selectedType })
      })

      const response = await fetch(`/api/facilities?${params}`)
      const data = await response.json()
      
      if (data.facilities) {
        setFacilities(data.facilities)
      }
    } catch (error) {
      console.error('Error fetching facilities:', error)
      // Use mock data if API fails
      setFacilities([
        {
          id: 1,
          account_name: 'Advanced Spine Center',
          account_record_type: 'ASC',
          specialty: 'Ortho Spine',
          territory: 'Wisconsin East',
          account_owner: 'Eric Swick',
          shipping_address_line_1: '123 Medical Drive',
          shipping_city: 'Milwaukee',
          shipping_state: 'WI',
          shipping_zip: '53202',
          phone: '(414) 555-0123',
          website: 'https://advancedspine.com'
        },
        {
          id: 2,
          account_name: 'Regional Medical Center',
          account_record_type: 'Hospital',
          specialty: 'Multi-Specialty',
          territory: 'Wisconsin East',
          account_owner: 'Eric Swick',
          shipping_address_line_1: '456 Hospital Blvd',
          shipping_city: 'Madison',
          shipping_state: 'WI',
          shipping_zip: '53703',
          phone: '(608) 555-0456',
          website: 'https://regionalmed.com'
        }
      ])
    } finally {
      setLoading  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = !searchTerm || 
      facility.account_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.shipping_city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.shipping_state?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTerritory = !selectedTerritory || facility.territory === selectedTerritory
    const matchesSpecialty = !selectedSpecialty || facility.specialty === selectedSpecialty
    const matchesType = !selectedType || facility.account_record_type === selectedType
    
    return matchesSearch && matchesTerritory && matchesSpecialty && matchesType
  })

  const handleViewDetails = (facilityId) => {
    setSelectedFacilityId(facilityId)
    setShowFacilityDetails(true)
  }

  const handleBackToList = () => {
    setShowFacilityDetails(false)
    setSelectedFacilityId(null)
  }ory).filter(Boolean))]
  const specialties = [...new Set(facilities.map(f => f.specialty).filter(Boolean))]
  const types = [...new Set(facilities.map(f => f.account_record_type).filter(Boolean))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading facilities...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Facilities</h2>
          <p className="text-gray-600">Manage your facility network and relationships</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Facility</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Facilities</p>
              <p className="text-2xl font-bold text-blue-600">{facilities.length}</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Territories</p>
              <p className="text-2xl font-bold text-green-600">{territories.length}</p>
            </div>
            <MapPin className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Specialties</p>
              <p className="text-2xl font-bold text-purple-600">{specialties.length}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Account Types</p>
              <p className="text-2xl font-bold text-orange-600">{types.length}</p>
            </div>
            <Filter className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search facilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedTerritory}
            onChange={(e) => setSelectedTerritory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Territories</option>
            {territories.map(territory => (
              <option key={territory} value={territory}>{territory}</option>
            ))}
          </select>
          
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Specialties</option>
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => (
          <div key={facility.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {facility.account_name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      facility.specialty === 'Ortho Spine' ? 'bg-blue-100 text-blue-800' :
                      facility.specialty === 'Neuro' ? 'bg-purple-100 text-purple-800' :
                      facility.specialty === 'Ortho' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {facility.specialty}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {facility.account_record_type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                {facility.shipping_address_line_1 && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>
                      {facility.shipping_address_line_1}, {facility.shipping_city}, {facility.shipping_state} {facility.shipping_zip}
                    </span>
                  </div>
                )}
                
                {facility.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{facility.phone}</span>
                  </div>
                )}
                
                {facility.account_owner && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{facility.account_owner}</span>
                  </div>
                )}
                
                {facility.territory && (
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <span>{facility.territory}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFacilities.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or add a new facility.</p>
        </div>
      )}

      {/* Add Facility Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Add New Facility</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facility Name *</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter facility name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select Account Type</option>
                      <option value="ASC">ASC</option>
                      <option value="Hospital">Hospital</option>
                      <option value="Clinic">Clinic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select Specialty</option>
                      <option value="Ortho">Ortho</option>
                      <option value="Neuro">Neuro</option>
                      <option value="Spine">Spine</option>
                      <option value="Pain">Pain</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Territory</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select Territory</option>
                      <option value="Wisconsin East">Wisconsin East</option>
                      <option value="Wisconsin West">Wisconsin West</option>
                      <option value="Illinois North">Illinois North</option>
                      <option value="Illinois South">Illinois South</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Street address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select State</option>
                      <option value="WI">Wisconsin</option>
                      <option value="IL">Illinois</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Zip code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fax</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input 
                      type="url" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Owner</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Account owner name"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Facility
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FacilityListFixed

