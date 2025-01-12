import React, { useState } from 'react';
import { usePatients } from '../hooks/useRealTimeData';
import { patientService } from '../services/api';

const PatientList: React.FC = () => {
  const { data: patients, isLoading, error } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients?.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        Error loading patients
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Patients</h2>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="divide-y">
        {filteredPatients?.map((patient) => (
          <div key={patient.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-600">{patient.email}</p>
                <p className="text-sm text-gray-500">{patient.phone}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {/* View patient details */}}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => {/* Edit patient */}}
                  className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this patient?')) {
                      try {
                        await patientService.delete(patient.id);
                      } catch (error) {
                        console.error('Error deleting patient:', error);
                      }
                    }
                  }}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {patient.gender}
              </span>
              {patient.age && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {patient.age} years
                </span>
              )}
              {patient.blood_group && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {patient.blood_group}
                </span>
              )}
            </div>
            {patient.address && (
              <p className="mt-2 text-sm text-gray-500">{patient.address}</p>
            )}
          </div>
        ))}
        {filteredPatients?.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? 'No patients found matching your search' : 'No patients found'}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList; 