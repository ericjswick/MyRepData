import { useState, useRef } from 'react'
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, X, Building2, Stethoscope } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Progress } from '@/components/ui/progress.jsx'

const BulkUploadEnhanced = () => {
  const [activeTab, setActiveTab] = useState('facilities') // facilities or physicians
  const [uploadStatus, setUploadStatus] = useState('idle') // idle, uploading, success, error
  const [uploadResults, setUploadResults] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file) => {
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
      setSelectedFile(file)
      setUploadStatus('idle')
      setUploadResults(null)
    } else {
      alert('Please select a valid Excel file (.xlsx, .xls) or CSV file (.csv)')
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploadStatus('uploading')
    
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const endpoint = activeTab === 'facilities' ? '/api/facilities/bulk-upload' : '/api/physicians/bulk-upload'
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        setUploadStatus('success')
        setUploadResults(result)
      } else {
        setUploadStatus('error')
        setUploadResults({ error: result.error || 'Upload failed' })
      }
    } catch (error) {
      setUploadStatus('error')
      setUploadResults({ error: 'Network error occurred' })
    }
  }

  const downloadTemplate = async () => {
    try {
      const endpoint = activeTab === 'facilities' ? '/api/facilities/template' : '/api/physicians/template'
      const response = await fetch(endpoint)
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${activeTab}_template.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading template:', error)
      alert('Failed to download template')
    }
  }

  const resetUpload = () => {
    setSelectedFile(null)
    setUploadStatus('idle')
    setUploadResults(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const switchTab = (tab) => {
    setActiveTab(tab)
    resetUpload()
  }

  const getTabConfig = () => {
    if (activeTab === 'facilities') {
      return {
        title: 'Bulk Upload Facilities',
        description: 'Upload facilities in bulk using Excel or CSV files',
        icon: Building2,
        templateFields: [
          'Account Name', 'Address Line 1', 'Address Line 2', 'City', 'State', 'Zip Code',
          'Phone', 'Fax', 'Website', 'Territory', 'Account Type', 'Specialty', 'Account Owner'
        ],
        sampleData: {
          'Account Name': 'Advanced Spine Center',
          'Address Line 1': '123 Medical Drive',
          'City': 'Milwaukee',
          'State': 'WI',
          'Zip Code': '53202',
          'Phone': '(414) 555-0123',
          'Territory': 'Wisconsin East',
          'Account Type': 'Hospital',
          'Specialty': 'Ortho Spine'
        }
      }
    } else {
      return {
        title: 'Bulk Upload Physicians',
        description: 'Upload treating physicians in bulk using Excel or CSV files',
        icon: Stethoscope,
        templateFields: [
          'Full Name', 'First Name', 'Last Name', 'NPI', 'Specialty', 'Degree',
          'Account Owner', 'First Surgery Date', 'Office Name', 'Address Line 1', 'Address Line 2',
          'City', 'State', 'Zip Code', 'Phone', 'Fax', 'Mobile', 'Email', 'Website'
        ],
        sampleData: {
          'Full Name': 'Dr. John Smith',
          'First Name': 'John',
          'Last Name': 'Smith',
          'NPI': '1234567890',
          'Specialty': 'Ortho Spine',
          'Account Owner': 'Eric Swick',
          'First Surgery Date': '2020-01-15',
          'City': 'Milwaukee',
          'State': 'WI',
          'Phone': '(414) 555-0123'
        }
      }
    }
  }

  const config = getTabConfig()
  const IconComponent = config.icon

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bulk Upload</h2>
          <p className="text-gray-600">Upload facilities or physicians in bulk using Excel or CSV files</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => switchTab('facilities')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'facilities'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Facilities</span>
          </button>
          <button
            onClick={() => switchTab('physicians')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'physicians'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Stethoscope className="h-4 w-4" />
            <span>Physicians</span>
          </button>
        </div>
      </div>

      {/* Template Download */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
          <p className="text-gray-600">{config.description}</p>
        </div>
        <Button variant="outline" onClick={downloadTemplate} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Download {activeTab === 'facilities' ? 'Facilities' : 'Physicians'} Template</span>
        </Button>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5" />
            <span>How to Use Bulk Upload</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Download Template</h4>
                  <p className="text-sm text-gray-600">Get the CSV template with the correct column format</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Fill Your Data</h4>
                  <p className="text-sm text-gray-600">Add your {activeTab} data following the template format</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Upload File</h4>
                  <p className="text-sm text-gray-600">Drag & drop or select your completed file</p>
                </div>
              </div>
            </div>

            {/* Template Fields Preview */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Required Fields:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {config.templateFields.map((field, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {field}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sample Data Preview */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Sample Data:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                {Object.entries(config.sampleData).map(([key, value]) => (
                  <div key={key} className="flex">
                    <span className="font-medium w-32">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <IconComponent className="h-5 w-5" />
            <span>Upload {activeTab === 'facilities' ? 'Facilities' : 'Physicians'} File</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetUpload}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {uploadStatus === 'idle' && (
                  <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {activeTab === 'facilities' ? 'Facilities' : 'Physicians'}
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your {activeTab} file here
                  </p>
                  <p className="text-gray-600">or click to browse</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadStatus === 'uploading' && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium">Uploading {activeTab}...</span>
              </div>
              <Progress value={75} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Results */}
      {uploadStatus === 'success' && uploadResults && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Successfully uploaded {uploadResults.created || 0} {activeTab}!
            {uploadResults.updated && ` Updated ${uploadResults.updated} existing records.`}
            {uploadResults.errors && uploadResults.errors.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Errors encountered:</p>
                <ul className="list-disc list-inside text-sm">
                  {uploadResults.errors.slice(0, 5).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {uploadStatus === 'error' && uploadResults && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {uploadResults.error || 'Upload failed. Please check your file format and try again.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default BulkUploadEnhanced

