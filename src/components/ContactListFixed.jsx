import React, { useState } from 'react'
import { Users, Search, Plus, Mail, Phone, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'

const ContactListFixed = () => {
  const [contacts] = useState([
    {
      id: 1,
      first_name: 'Dr. John',
      last_name: 'Smith',
      title: 'Orthopedic Surgeon',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      facility: { account_name: 'Advanced Spine Center' },
      specialty: 'Ortho',
      is_primary: true
    },
    {
      id: 2,
      first_name: 'Sarah',
      last_name: 'Johnson',
      title: 'Surgery Coordinator',
      email: 'sarah.j@example.com',
      phone: '(555) 987-6543',
      facility: { account_name: 'Access Medical Center' },
      specialty: 'Admin',
      is_primary: false
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    title: '',
    email: '',
    phone: '',
    mobile: '',
    fax: '',
    facility_id: '',
    department: '',
    specialty: '',
    is_primary: false,
    notes: ''
  })

  const handleAddContact = () => {
    setShowAddModal(true)
  }

  const handleEditContact = (contact) => {
    setSelectedContact(contact)
    setFormData({
      first_name: contact.first_name,
      last_name: contact.last_name,
      title: contact.title,
      email: contact.email,
      phone: contact.phone,
      mobile: contact.mobile || '',
      fax: contact.fax || '',
      facility_id: contact.facility_id || '',
      department: contact.department || '',
      specialty: contact.specialty,
      is_primary: contact.is_primary,
      notes: contact.notes || ''
    })
    setShowEditModal(true)
  }

  const handleViewContact = (contact) => {
    setSelectedContact(contact)
    setShowViewModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setSelectedContact(null)
    setFormData({
      first_name: '',
      last_name: '',
      title: '',
      email: '',
      phone: '',
      mobile: '',
      fax: '',
      facility_id: '',
      department: '',
      specialty: '',
      is_primary: false,
      notes: ''
    })
  }

  const handleCloseViewModal = () => {
    setShowViewModal(false)
    setSelectedContact(null)
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setFormData({
      first_name: '',
      last_name: '',
      title: '',
      email: '',
      phone: '',
      mobile: '',
      fax: '',
      facility_id: '',
      department: '',
      specialty: '',
      is_primary: false,
      notes: ''
    })
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        handleCloseModal()
        alert('Contact added successfully!')
        // Refresh contacts list here
      } else {
        alert('Error adding contact')
      }
    } catch (error) {
      console.error('Error adding contact:', error)
      alert('Error adding contact')
    }
  }

  const AddContactModal = () => (
    <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Add New Contact
          </DialogTitle>
          <DialogDescription>
            Add a new contact to your facility network
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title/Position</Label>
            <Input
              id="title"
              placeholder="e.g., Surgery Coordinator, Administrator"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                placeholder="(555) 123-4567"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fax">Fax</Label>
              <Input
                id="fax"
                placeholder="(555) 123-4567"
                value={formData.fax}
                onChange={(e) => handleInputChange('fax', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facility_id">Facility</Label>
              <Select value={formData.facility_id} onValueChange={(value) => handleInputChange('facility_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Advanced Spine Center</SelectItem>
                  <SelectItem value="2">Regional Medical Center</SelectItem>
                  <SelectItem value="3">Access Medical Center</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g., Surgery, Administration"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ortho">Orthopedic</SelectItem>
                <SelectItem value="Neuro">Neurosurgery</SelectItem>
                <SelectItem value="Spine">Spine</SelectItem>
                <SelectItem value="Pain">Pain Management</SelectItem>
                <SelectItem value="Admin">Administration</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_primary"
              checked={formData.is_primary}
              onChange={(e) => handleInputChange('is_primary', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="is_primary" className="text-sm">
              Primary contact for this facility
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Additional notes or information"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Add Contact
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contacts</h2>
          <p className="text-gray-600">Manage contacts across all facilities</p>
        </div>
        <Button onClick={handleAddContact}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contacts..."
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {contact.first_name} {contact.last_name}
                      </h3>
                      <p className="text-gray-600">{contact.title}</p>
                    </div>
                    {contact.is_primary && (
                      <Badge variant="default" className="bg-blue-100 text-blue-800">
                        Primary
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{contact.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{contact.phone}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{contact.facility.account_name}</p>
                      <p className="text-gray-600">{contact.specialty}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditContact(contact)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewContact(contact)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Contact Modal */}
      <AddContactModal />

      {/* Edit Contact Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Edit Contact</h2>
                <button 
                  onClick={handleCloseEditModal}
                  className="text-white hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter last name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title/Position
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter title or position"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialty
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter specialty"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes..."
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Contact Details</h2>
                <button 
                  onClick={handleCloseViewModal}
                  className="text-white hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900">{selectedContact.first_name} {selectedContact.last_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Title/Position</label>
                      <p className="text-gray-900">{selectedContact.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Specialty</label>
                      <p className="text-gray-900">{selectedContact.specialty}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedContact.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{selectedContact.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Primary Contact</label>
                      <p className="text-gray-900">{selectedContact.is_primary ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Facility Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Facility</label>
                  <p className="text-gray-900">{selectedContact.facility.account_name}</p>
                </div>
              </div>
              
              {selectedContact.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{selectedContact.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleCloseViewModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactListFixed

