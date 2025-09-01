import { useState } from 'react'
import { Users, Search, Plus, Mail, Phone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'

const ContactList = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contacts</h2>
          <p className="text-gray-600">Manage contacts across all facilities</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search contacts..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {contact.first_name} {contact.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{contact.title}</p>
                  </div>
                  {contact.is_primary && (
                    <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{contact.phone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600">{contact.facility.account_name}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {contact.specialty}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ContactList

