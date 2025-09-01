import { useState } from 'react'
import { Activity, Plus, Calendar, MapPin, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'

const ActivityList = () => {
  const [activities] = useState([
    {
      id: 1,
      activity_type: 'Visit',
      subject: 'Product Demo at Advanced Spine Center',
      description: 'Demonstrated SI Joint fusion procedure to Dr. Smith',
      activity_date: '2025-08-11',
      status: 'Completed',
      facility: { account_name: 'Advanced Spine Center' },
      contact: { first_name: 'Dr. John', last_name: 'Smith' },
      created_by: 'Eric Swick'
    },
    {
      id: 2,
      activity_type: 'Call',
      subject: 'Follow-up on SI Joint procedure',
      description: 'Discussed case outcomes and future opportunities',
      activity_date: '2025-08-10',
      status: 'Completed',
      facility: { account_name: 'Access Medical Center' },
      created_by: 'Eric Swick'
    },
    {
      id: 3,
      activity_type: 'Training',
      subject: 'Lateral approach training scheduled',
      description: 'Training session for new surgical technique',
      activity_date: '2025-08-15',
      status: 'Scheduled',
      facility: { account_name: 'Algonquin Road Surgery Center' },
      created_by: 'Eric Swick'
    }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Visit':
        return 'bg-purple-100 text-purple-800'
      case 'Call':
        return 'bg-blue-100 text-blue-800'
      case 'Training':
        return 'bg-orange-100 text-orange-800'
      case 'Demo':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activities</h2>
          <p className="text-gray-600">Track sales activities and interactions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Log Activity
        </Button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {activity.subject}
                    </h3>
                    <div className="flex space-x-2">
                      <Badge className={`text-xs ${getTypeColor(activity.activity_type)}`}>
                        {activity.activity_type}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-600">{activity.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(activity.activity_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{activity.facility.account_name}</span>
                    </div>
                    {activity.contact && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>{activity.contact.first_name} {activity.contact.last_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-500">
                      Created by {activity.created_by}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Follow-up
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ActivityList

