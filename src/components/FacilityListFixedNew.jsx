import React, { useState, useEffect } from 'react'
import { Search, Plus, Filter, MapPin, Phone, Mail, Building2, Users, Eye, X } from 'lucide-react'

const FacilityListFixedNew = () => {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTerritory, setSelectedTerritory] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFacilityDetails, setShowFacilityDetails] = useState(false)
  const [selectedFacilityId, setSelectedFacilityId] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingFacility, setEditingFacility] = useState(null)
  
  // Add Facility Form State
  const [facilityForm, setFacilityForm] = useState({
    facilityName: '',
    facilityType: '',
    specialty: '',
    territory: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    website: '',
    accountOwner: '',
    notes: ''
  })

  useEffect(() => {
    fetchFacilities()
  }, [searchTerm, selectedTerritory, selectedSpecialty, selectedType])

  const fetchFacilities = async () => {
    try {
      setLoading(true)
      // Use mock data for now
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
          specialty: 'Neuro',
          territory: 'Wisconsin West',
          account_owner: 'Moore Medical Solutions, LLC',
          shipping_address_line_1: '456 Healthcare Blvd',
          shipping_city: 'Madison',
          shipping_state: 'WI',
          shipping_zip: '53703',
          phone: '(608) 555-0456',
          website: 'https://regionalmed.com'
        }
      ])
    } catch (error) {
      console.error('Error fetching facilities:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFacilities = facilities.filter(facility => {
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
    console.log('View details for facility:', facilityId)
    setSelectedFacilityId(facilityId)
    setShowFacilityDetails(true)
  }

  const handleBackToList = () => {
    setShowFacilityDetails(false)
    setSelectedFacilityId(null)
  }

  const handleEditFacility = (facility) => {
    setEditingFacility(facility)
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    // Update facility in the list
    setFacilities(facilities.map(f => 
      f.id === editingFacility.id ? editingFacility : f
    ))
    setShowEditModal(false)
    setEditingFacility(null)
  }

  // Add Facility Form Handlers
  const handleFacilityFormChange = (field, value) => {
    setFacilityForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddFacility = () => {
    // Create new facility object
    const newFacility = {
      id: facilities.length + 1,
      account_name: facilityForm.facilityName,
      account_record_type: facilityForm.facilityType,
      specialty: facilityForm.specialty,
      territory: facilityForm.territory,
      account_owner: facilityForm.accountOwner,
      shipping_address_line_1: facilityForm.address,
      shipping_city: facilityForm.city,
      shipping_state: facilityForm.state,
      shipping_zip: facilityForm.zipCode,
      phone: facilityForm.phone,
      website: facilityForm.website,
      notes: facilityForm.notes
    }
    
    // Add to facilities list
    setFacilities([...facilities, newFacility])
    
    // Reset form and close modal
    setFacilityForm({
      facilityName: '',
      facilityType: '',
      specialty: '',
      territory: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      website: '',
      accountOwner: '',
      notes: ''
    })
    setShowAddModal(false)
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setFacilityForm({
      facilityName: '',
      facilityType: '',
      specialty: '',
      territory: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      website: '',
      accountOwner: '',
      notes: ''
    })
  }

  const territories = [...new Set(facilities.map(f => f.territory).filter(Boolean))]
  const specialties = [...new Set(facilities.map(f => f.specialty).filter(Boolean))]
  const types = [...new Set(facilities.map(f => f.account_record_type).filter(Boolean))]

  // If showing facility details, render the details component
  if (showFacilityDetails && selectedFacilityId) {
    const selectedFacility = facilities.find(f => f.id === selectedFacilityId)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleBackToList}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <span>← Back to Facilities</span>
          </button>
          <button 
            onClick={() => handleEditFacility(selectedFacility)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <span>Edit Facility</span>
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {selectedFacility?.account_name}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{selectedFacility?.account_record_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialty:</span>
                  <span className="font-medium">{selectedFacility?.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Territory:</span>
                  <span className="font-medium">{selectedFacility?.territory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Owner:</span>
                  <span className="font-medium">{selectedFacility?.account_owner}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {selectedFacility?.shipping_address_line_1}<br/>
                    {selectedFacility?.shipping_city}, {selectedFacility?.shipping_state} {selectedFacility?.shipping_zip}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{selectedFacility?.phone}</span>
                </div>
                {selectedFacility?.website && (
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <a href={selectedFacility.website} target="_blank" rel="noopener noreferrer" 
                       className="text-sm text-blue-600 hover:text-blue-700">
                      {selectedFacility.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
              <p className="text-sm font-medium text-gray-600">ASCs</p>
              <p className="text-2xl font-bold text-green-600">
                {facilities.filter(f => f.account_record_type === 'ASC').length}
              </p>
            </div>
            <Building2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hospitals</p>
              <p className="text-2xl font-bold text-purple-600">
                {facilities.filter(f => f.account_record_type === 'Hospital').length}
              </p>
            </div>
            <Building2 className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Territories</p>
              <p className="text-2xl font-bold text-orange-600">{territories.length}</p>
            </div>
            <MapPin className="h-8 w-8 text-orange-600" />
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedTerritory}
            onChange={(e) => setSelectedTerritory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Territories</option>
            {territories.map(territory => (
              <option key={territory} value={territory}>{territory}</option>
            ))}
          </select>
          
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Specialties</option>
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <button 
                  onClick={() => handleViewDetails(facility.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-1"
                >
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
                  onClick={handleCloseAddModal}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facility Name *
                    </label>
                    <input
                      type="text"
                      value={facilityForm.facilityName}
                      onChange={(e) => handleFacilityFormChange('facilityName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter facility name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facility Type *
                    </label>
                    <select
                      value={facilityForm.facilityType}
                      onChange={(e) => handleFacilityFormChange('facilityType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Facility Type</option>
                      <option value="ASC">ASC (Ambulatory Surgery Center)</option>
                      <option value="Hospital">Hospital</option>
                      <option value="Clinic">Clinic</option>
                      <option value="Surgery Center">Surgery Center</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialty *
                    </label>
                    <select
                      value={facilityForm.specialty}
                      onChange={(e) => handleFacilityFormChange('specialty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Specialty</option>
                      <option value="Ortho Spine">Ortho Spine</option>
                      <option value="Neuro">Neuro</option>
                      <option value="Orthopedic">Orthopedic</option>
                      <option value="Neurosurgery">Neurosurgery</option>
                      <option value="Sports Medicine">Sports Medicine</option>
                      <option value="Pain Management">Pain Management</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Territory *
                    </label>
                    <select
                      value={facilityForm.territory}
                      onChange={(e) => handleFacilityFormChange('territory', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Territory</option>
                      <option value="Wisconsin East">Wisconsin East</option>
                      <option value="Wisconsin West">Wisconsin West</option>
                      <option value="Wisconsin North">Wisconsin North</option>
                      <option value="Wisconsin South">Wisconsin South</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={facilityForm.address}
                      onChange={(e) => handleFacilityFormChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter street address"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={facilityForm.city}
                        onChange={(e) => handleFacilityFormChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <select
                        value={facilityForm.state}
                        onChange={(e) => handleFacilityFormChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select State</option>
                        <option value="WI">Wisconsin</option>
                        <option value="IL">Illinois</option>
                        <option value="MN">Minnesota</option>
                        <option value="IA">Iowa</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={facilityForm.zipCode}
                        onChange={(e) => handleFacilityFormChange('zipCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter ZIP code"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={facilityForm.phone}
                        onChange={(e) => handleFacilityFormChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={facilityForm.website}
                        onChange={(e) => handleFacilityFormChange('website', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Owner
                    </label>
                    <input
                      type="text"
                      value={facilityForm.accountOwner}
                      onChange={(e) => handleFacilityFormChange('accountOwner', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter account owner name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={facilityForm.notes}
                      onChange={(e) => handleFacilityFormChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter any additional notes or comments"
                    />
                  </div>
                </div>
              </form>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={handleCloseAddModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddFacility}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Facility
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Facility Modal */}
      {showEditModal && editingFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Edit Facility</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facility Name
                    </label>
                    <input
                      type="text"
                      value={editingFacility.account_name || ''}
                      onChange={(e) => setEditingFacility({...editingFacility, account_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={editingFacility.account_record_type || ''}
                      onChange={(e) => setEditingFacility({...editingFacility, account_record_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      <option value="ASC">ASC</option>
                      <option value="Hospital">Hospital</option>
                      <option value="Clinic">Clinic</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialty
                    </label>
                    <select
                      value={editingFacility.specialty || ''}
                      onChange={(e) => setEditingFacility({...editingFacility, specialty: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Specialty</option>
                      <option value="Ortho Spine">Ortho Spine</option>
                      <option value="Neuro">Neuro</option>
                      <option value="Ortho">Ortho</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Territory
                    </label>
                    <input
                      type="text"
                      value={editingFacility.territory || ''}
                      onChange={(e) => setEditingFacility({...editingFacility, territory: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={editingFacility.shipping_address_line_1 || ''}
                      onChange={(e) => setEditingFacility({...editingFacility, shipping_address_line_1: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={editingFacility.shipping_city || ''}
                      onChange={(e) => setEditingFacility({...editingFacility, shipping_city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={editingFacility.shipping_state || ''}
                      onChange={(e) => setEditingFacility({...editingFacility, shipping_state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={editingFacility.shipping_zip || ''}
                      onChange={(e) => setEditingFacility({...editingFacility, shipping_zip: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={editingFacility.phone || ''}
                      onChange={(e) => setEditingFacility({...editingFacility, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="text"
                      value={editingFacility.website || ''}
                      onChange={(e) => setEditingFacility({...editingFacility, website: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Owner
                    </label>
                    <input
                      type="text"
                      value={editingFacility.account_owner || ''}
                      onChange={(e) => setEditingFacility({...editingFacility, account_owner: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </form>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FacilityListFixedNew

