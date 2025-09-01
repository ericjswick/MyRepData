import { useState } from 'react'
import { Menu, X, Settings, Home, Building2, Users, UserCheck, Activity, Calendar, Package, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'

// Import components
import DashboardMobile from '@/components/DashboardMobile.jsx'
import FacilityListFixed from '@/components/FacilityListFixed.jsx'
import PhysicianListFixed from '@/components/PhysicianListFixed.jsx'
import ContactListFixed from '@/components/ContactListFixed.jsx'
import ActivityList from '@/components/ActivityList.jsx'
import AppointmentSchedulerFixed from '@/components/AppointmentSchedulerFixed.jsx'
import TrayTracking from '@/components/TrayTracking.jsx'
import BulkUploadEnhanced from '@/components/BulkUploadEnhanced.jsx'

function AppMobileFixed() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'bg-blue-100 text-blue-800' },
    { id: 'facilities', label: 'Facilities', icon: Building2, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'physicians', label: 'Physicians', icon: Users, color: 'bg-purple-100 text-purple-800' },
    { id: 'contacts', label: 'Contacts', icon: UserCheck, color: 'bg-teal-100 text-teal-800' },
    { id: 'activities', label: 'Activities', icon: Activity, color: 'bg-pink-100 text-pink-800' },
    { id: 'scheduling', label: 'Scheduling', icon: Calendar, color: 'bg-indigo-100 text-indigo-800' },
    { id: 'tray-tracking', label: 'Tray Tracking', icon: Package, color: 'bg-orange-100 text-orange-800' },
    { id: 'bulk-upload', label: 'Bulk Upload', icon: Upload, color: 'bg-green-100 text-green-800' }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardMobile />
      case 'facilities':
        return <FacilityListFixed />
      case 'physicians':
        return <PhysicianListFixed />
      case 'contacts':
        return <ContactListFixed />
      case 'activities':
        return <ActivityList />
      case 'scheduling':
        return <AppointmentSchedulerFixed />
      case 'tray-tracking':
        return <TrayTracking />
      case 'bulk-upload':
        return <BulkUploadEnhanced />
      default:
        return <DashboardMobile />
    }
  }

  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Medical Sales CRM</h1>
            <p className="text-xs text-gray-600">Facility & Tray Management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
            Connected to TrayTracker
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-[73px] left-0 right-0 bg-white border-b border-gray-200 px-4 py-2 z-40 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  onClick={() => handleNavigation(item.id)}
                  className={`justify-start gap-2 h-12 text-sm ${
                    activeSection === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{item.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Desktop Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          {/* Desktop Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Medical Sales CRM</h1>
                <p className="text-sm text-gray-600">Facility & Tray Management</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Badge className="bg-green-100 text-green-800">
                Connected to TrayTracker
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full justify-start gap-3 h-12 ${
                    activeSection === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </div>

        {/* Desktop Main Content */}
        <div className="flex-1">
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile Main Content */}
      <div className="lg:hidden pb-20">
        <div className="p-4">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50 shadow-lg">
        <div className="flex justify-around">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => handleNavigation(item.id)}
                className={`flex flex-col items-center gap-1 h-14 px-1 min-w-0 flex-1 ${
                  activeSection === item.id 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs truncate max-w-full leading-tight">
                  {item.label === 'Dashboard' ? 'Home' : 
                   item.label === 'Physicians' ? 'Doctors' : 
                   item.label === 'Activities' ? 'Activity' : 
                   item.label}
                </span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="lg:hidden h-20"></div>
    </div>
  )
}

export default AppMobileFixed

