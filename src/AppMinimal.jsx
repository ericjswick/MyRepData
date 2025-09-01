import React, { useState } from 'react'
import { Building2, BarChart3 } from 'lucide-react'

function AppMinimal() {
  const [activeTab, setActiveTab] = useState('dashboard')

  console.log('AppMinimal rendered, activeTab:', activeTab)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Medical Sales CRM</h1>
              <p className="text-sm text-gray-500">Test Version</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Dashboard Test</h2>
          <p className="text-gray-600 mb-4">
            This is a minimal test version to identify navigation issues.
          </p>
          <div className="space-y-2">
            <p>Current tab: {activeTab}</p>
            <p>Component rendered successfully</p>
            <p>No automatic navigation should occur</p>
          </div>
          
          <div className="mt-6 space-x-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('test')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Test Tab
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppMinimal

