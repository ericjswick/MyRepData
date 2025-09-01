import React, { useState } from 'react'
import { Building2, Users, Activity, Package, BarChart3, Upload, Settings, Stethoscope, Calendar, Menu, X, Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import './App.css'

// Import existing components
import Dashboard from './components/Dashboard'
import FacilityList from './components/FacilityListFixed'
import FacilityDetails from './components/FacilityDetails'
import ContactList from './components/ContactList'
import ActivityList from './components/ActivityList'
import TrayTracking from './components/TrayTracking'
import BulkUpload from './components/BulkUploadEnhanced'

// Import new physician components
import PhysicianList from './components/PhysicianListFixed'
import PhysicianDetails from './components/PhysicianDetails'
import AppointmentScheduler from './components/AppointmentScheduler'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, shortName: 'Home' },
    { id: 'facilities', name: 'Facilities', icon: Building2, shortName: 'Facilities' },
    { id: 'physicians', name: 'Physicians', icon: Stethoscope, shortName: 'Doctors' },
    { id: 'contacts', name: 'Contacts', icon: Users, shortName: 'Contacts' },
    { id: 'activities', name: 'Activities', icon: Activity, shortName: 'Activity' },
    { id: 'scheduling', name: 'Scheduling', icon: Calendar, shortName: 'Schedule' },
    { id: 'trays', name: 'Tray Tracking', icon: Package, shortName: 'Trays' },
    { id: 'upload', name: 'Bulk Upload', icon: Upload, shortName: 'Upload' },
  ]

  const handleNavClick = (tabId) => {
    setActiveTab(tabId)
    setMobileMenuOpen(false)
  }

  const getPageTitle = () => {
    const page = navigation.find(nav => nav.id === activeTab)
    return page ? page.name : 'Dashboard'
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'facilities':
        return <FacilityList />
      case 'physicians':
        return <PhysicianList />
      case 'contacts':
        return <ContactList />
      case 'activities':
        return <ActivityList />
      case 'scheduling':
        return <AppointmentScheduler />
      case 'trays':
        return <TrayTracking />
      case 'upload':
        return <BulkUpload />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Mobile Header */}
      <header className="bg-white shadow-sm border-b lg:hidden sticky top-0 z-30">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {getPageTitle()}
                </h1>
                <p className="text-xs text-gray-500 -mt-0.5">Medical Sales CRM</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs px-2 py-1">
                Live
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 rounded-xl"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header - Unchanged */}
      <header className="bg-white shadow-sm border-b hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Medical Sales CRM
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                Connected to TrayTracker
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Premium Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl">
            <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-xl">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-lg">Menu</h2>
                    <p className="text-blue-100 text-sm">Medical Sales CRM</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-xl"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <nav className="p-4 space-y-2 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${
                      activeTab === item.id ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.id === 'dashboard' && 'Overview & Analytics'}
                        {item.id === 'facilities' && 'Surgical Centers'}
                        {item.id === 'physicians' && 'Treating Doctors'}
                        {item.id === 'contacts' && 'Contact Database'}
                        {item.id === 'activities' && 'Sales Activities'}
                        {item.id === 'scheduling' && 'Appointments'}
                        {item.id === 'trays' && 'TrayTracker Sync'}
                        {item.id === 'upload' && 'Bulk Data Import'}
                      </div>
                    </div>
                  </button>
                )
              })}
            </nav>
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-sm font-medium text-green-800">TrayTracker Connected</p>
                  <p className="text-xs text-green-600">Real-time sync active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl lg:hidden z-40">
        <div className="px-2 py-2">
          <div className="flex justify-around">
            {navigation.slice(0, 5).map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-gray-50 active:scale-95'
                  }`}
                >
                  <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-white' : ''}`} />
                  <span className={`text-xs font-medium ${isActive ? 'text-white' : ''}`}>
                    {item.shortName}
                  </span>
                  {isActive && (
                    <div className="w-1 h-1 bg-white rounded-full mt-1"></div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Unchanged */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar Navigation */}
            <div className="w-64 flex-shrink-0">
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Desktop Main Content */}
            <div className="flex-1 min-w-0">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Main Content with Premium Spacing */}
        <div className="px-4 py-4 pb-24 min-h-screen">
          <div className="space-y-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

