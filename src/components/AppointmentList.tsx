import React from 'react';
import { useAppointments } from '../hooks/useRealTimeData';
import { format } from 'date-fns';

const AppointmentList: React.FC = () => {
  const { data: appointments, isLoading, error } = useAppointments();

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
        Error loading appointments
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Recent Appointments</h2>
      </div>
      <div className="divide-y">
        {appointments?.map((appointment) => (
          <div key={appointment.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{appointment.patient_name}</h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(appointment.date), 'PPP')} at{' '}
                  {format(new Date(`2000-01-01T${appointment.time}`), 'p')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {appointment.appointment_type} - {appointment.consultation_mode}
                </p>
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    appointment.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : appointment.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : appointment.status === 'confirmed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
            </div>
            {appointment.notes && (
              <p className="mt-2 text-sm text-gray-500">{appointment.notes}</p>
            )}
          </div>
        ))}
        {appointments?.length === 0 && (
          <div className="p-4 text-center text-gray-500">No appointments found</div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList; 