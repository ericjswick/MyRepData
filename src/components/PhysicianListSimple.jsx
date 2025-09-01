import { useState, useEffect } from 'react'

const PhysicianListSimple = () => {
  const [physicians, setPhysicians] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPhysicians()
  }, [])

  const fetchPhysicians = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/physicians')
      const data = await response.json()
      setPhysicians(data.physicians || [])
    } catch (error) {
      console.error('Error fetching physicians:', error)
      setPhysicians([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading physicians...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Treating Physicians</h1>
      <p className="mb-4">Total physicians: {physicians.length}</p>
      
      <div className="grid gap-4">
        {physicians.map((physician) => (
          <div key={physician.id} className="border p-4 rounded">
            <h3 className="font-semibold">{physician.full_name}</h3>
            <p>Specialty: {physician.specialty}</p>
            <p>NPI: {physician.npi}</p>
            <p>Account Owner: {physician.account_owner}</p>
          </div>
        ))}
      </div>
      
      {physicians.length === 0 && (
        <p>No physicians found.</p>
      )}
    </div>
  )
}

export default PhysicianListSimple

