import { useState, useEffect } from 'react'
import { FileText, Plus, Search, Filter, AlertTriangle, CheckCircle, XCircle, Clock, Calendar, DollarSign, User, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'

const PreAuthorizationDashboard = () => {
  const [preAuths, setPreAuths] = useState([])
  const [pendingPreAuths, setPendingPreAuths] = useState([])
  const [expiringPreAuths, setExpiringPreAuths] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [stats, setStats] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedInsurance, setSelectedInsurance] = useState('')

  useEffect(() => {
    fetchPreAuthorizations()
    fetchPendingPreAuths()
    fetchExpiringPreAuths()
    fetchStats()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchPreAuthorizations()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, selectedStatus, selectedInsurance])

  const fetchPreAuthorizations = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedStatus) params.append('status', selectedStatus)
      if (selectedInsurance) params.append('insurance_company', selectedInsurance)
      
      const response = await fetch(`/api/pre-authorizations?${params}`)
      const data = await response.json()
      setPreAuths(data.pre_authorizations || [])
    } catch (error) {
      console.error('Error fetching pre-authorizations:', error)
      setPreAuths([])
    }
  }

  const fetchPendingPreAuths = async () => {
    try {
      const response = await fetch('/api/pre-authorizations/pending')
      const data = await response.json()
      setPendingPreAuths(data.pre_authorizations || [])
    } catch (error) {
      console.error('Error fetching pending pre-authorizations:', error)
      setPendingPreAuths([])
    }
  }

  const fetchExpiringPreAuths = async () => {
    try {
      const response = await fetch('/api/pre-authorizations/expiring')
      const data = await response.json()
      setExpiringPreAuths(data.pre_authorizations || [])
    } catch (error) {
      console.error('Error fetching expiring pre-authorizations:', error)
      setExpiringPreAuths([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/pre-authorizations/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching pre-authorization stats:', error)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Denied': 'bg-red-100 text-red-800',
      'Expired': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />
      case 'Denied':
        return <XCircle className="w-4 h-4" />
      case 'Expired':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getDaysUntilExpiry = (expirationDate) => {
    if (!expirationDate) return null
    const today = new Date()
    const expiry = new Date(expirationDate)
    const diffTime = expiry - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const PreAuthCard = ({ preAuth, showPhysician = true }) => {
    const daysUntilExpiry = getDaysUntilExpiry(preAuth.expiration_date)
    const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0
    const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {preAuth.procedure_name || 'Pre-Authorization Request'}
              </h3>
              <p className="text-sm text-gray-600">{preAuth.insurance_company}</p>
            </div>
            <div className="flex items-center gap-2">
              {preAuth.priority && (
                <Badge className={getPriorityColor(preAuth.priority)}>
                  {preAuth.priority}
                </Badge>
              )}
              <Badge className={getStatusColor(preAuth.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(preAuth.status)}
                  {preAuth.status}
                </div>
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            {showPhysician && preAuth.physician && (
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span>{preAuth.physician.full_name}</span>
              </div>
            )}

            {preAuth.facility && (
              <div className="flex items-center text-sm text-gray-600">
                <Building2 className="w-4 h-4 mr-2" />
                <span>{preAuth.facility.account_name}</span>
              </div>
            )}

            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Requested: {formatDate(preAuth.requested_date)}</span>
            </div>

            {preAuth.authorization_date && (
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Authorized: {formatDate(preAuth.authorization_date)}</span>
              </div>
            )}

            {preAuth.expiration_date && (
              <div className="flex items-center text-sm text-gray-600">
                <AlertTriangle className={`w-4 h-4 mr-2 ${isExpiringSoon || isExpired ? 'text-red-500' : ''}`} />
                <span className={isExpiringSoon || isExpired ? 'text-red-600 font-medium' : ''}>
                  Expires: {formatDate(preAuth.expiration_date)}
                  {daysUntilExpiry !== null && (
                    <span className="ml-1">
                      ({isExpired ? 'Expired' : `${daysUntilExpiry} days`})
                    </span>
                  )}
                </span>
              </div>
            )}

            {preAuth.approval_amount && (
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>Approved Amount: {formatCurrency(preAuth.approval_amount)}</span>
              </div>
            )}

            {preAuth.authorization_number && (
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="w-4 h-4 mr-2" />
                <span>Auth #: {preAuth.authorization_number}</span>
              </div>
            )}

            {preAuth.procedure_codes && (
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="w-4 h-4 mr-2" />
                <span>Codes: {preAuth.procedure_codes}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="flex-1">
              Edit
            </Button>
            {preAuth.status === 'Pending' && (
              <Button variant="outline" size="sm" className="flex-1">
                Approve
              </Button>
            )}
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pre-authorizations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pre-Authorization Dashboard</h1>
          <p className="text-gray-600">Manage insurance pre-authorizations and approvals</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Pre-Auth
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending_count || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">{stats.expiring_count || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-red-600">{stats.expired_count || 0}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.by_status?.find(s => s.status === 'Approved')?.count || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="expiring">Expiring</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Pending Pre-Authorizations</h3>
            <p className="text-sm text-gray-600">Requires immediate attention</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingPreAuths.map((preAuth) => (
              <PreAuthCard key={preAuth.id} preAuth={preAuth} />
            ))}
          </div>

          {pendingPreAuths.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending pre-authorizations</h3>
                <p className="text-gray-600 mb-4">All pre-authorizations are up to date</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Pre-Auth
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expiring" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Expiring Pre-Authorizations</h3>
            <p className="text-sm text-gray-600">Expiring within 30 days</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {expiringPreAuths.map((preAuth) => (
              <PreAuthCard key={preAuth.id} preAuth={preAuth} />
            ))}
          </div>

          {expiringPreAuths.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No expiring pre-authorizations</h3>
                <p className="text-gray-600">All pre-authorizations are current</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Approved Pre-Authorizations</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {preAuths.filter(pa => pa.status === 'Approved').map((preAuth) => (
              <PreAuthCard key={preAuth.id} preAuth={preAuth} />
            ))}
          </div>

          {preAuths.filter(pa => pa.status === 'Approved').length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No approved pre-authorizations</h3>
                <p className="text-gray-600">Approved pre-authorizations will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by physician, insurance, or procedure..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Denied">Denied</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Insurance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Insurance</SelectItem>
                    {stats.by_insurance?.map((insurance) => (
                      <SelectItem key={insurance.insurance} value={insurance.insurance}>
                        {insurance.insurance}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {preAuths.map((preAuth) => (
              <PreAuthCard key={preAuth.id} preAuth={preAuth} />
            ))}
          </div>

          {preAuths.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pre-authorizations found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedStatus || selectedInsurance
                    ? 'Try adjusting your search criteria'
                    : 'Start by creating your first pre-authorization request'}
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Pre-Auth
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PreAuthorizationDashboard

