import React, { useState } from 'react';
import { Calendar, List, Plus } from 'lucide-react';

const CasesModuleSimple = () => {
  const [viewMode, setViewMode] = useState('list');

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cases Management</h1>
          <p className="text-gray-600">Schedule and manage surgical cases with tray requirements</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Schedule Case
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4 inline mr-2" />
            List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Calendar View
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Test Cases Module</h2>
        <p className="text-gray-600">This is a simplified version to test if the component loads properly.</p>
        
        <div className="mt-4 space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium">L4-L5 Fusion</h3>
            <p className="text-sm text-gray-600">Dr. John Smith • Advanced Spine Center</p>
            <p className="text-sm text-gray-500">2024-09-02 at 08:00 AM</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium">Cervical Discectomy</h3>
            <p className="text-sm text-gray-600">Dr. Jane Doe • Regional Medical Center</p>
            <p className="text-sm text-gray-500">2024-09-02 at 10:30 AM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasesModuleSimple;

