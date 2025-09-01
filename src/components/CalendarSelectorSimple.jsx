import React from 'react'
import { Calendar, X } from 'lucide-react'

const CalendarSelectorSimple = ({ surgery, onClose }) => {
  console.log('CalendarSelectorSimple rendered with surgery:', surgery)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Add to Calendar</h2>
              <p className="text-blue-100 mt-1">{surgery?.procedure_name || 'Surgery'}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center">
            <Calendar className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Calendar Integration Test</h3>
            <p className="text-gray-600 mb-4">
              This is a test modal to verify the calendar selector is working.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Surgery: {surgery?.procedure_name || 'N/A'}</p>
              <p>Physician: {surgery?.physician_name || 'N/A'}</p>
              <p>Date: {surgery?.surgery_date || 'N/A'}</p>
              <p>Time: {surgery?.surgery_time || 'N/A'}</p>
            </div>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarSelectorSimple

