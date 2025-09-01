import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'

const FacilityDetails = ({ facilityId }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Facility Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Facility details for ID: {facilityId}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default FacilityDetails

