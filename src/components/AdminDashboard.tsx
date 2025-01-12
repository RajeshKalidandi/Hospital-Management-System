import React, { useState } from 'react';
import { useAppointments, usePatients, usePayments } from '../hooks/useRealTimeData';
import AppointmentList from './AppointmentList';
import PatientList from './PatientList';
import PaymentList from './PaymentList';
import { format } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: appointments } = useAppointments();
  const { data: patients } = usePatients();
  const { data: payments } = usePayments();

  // Calculate dashboard statistics
  const totalPatients = patients?.length || 0;
  const totalAppointments = appointments?.length || 0;
  const totalRevenue = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
  const pendingAppointments = appointments?.filter(app => app.status === 'pending').length || 0;

  const todayAppointments = appointments?.filter(app => 
    format(new Date(app.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ) || [];

  const recentPayments = payments?.slice(0, 5) || [];

  const StatCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-semibold ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text', 'bg')} bg-opacity-10`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon="👥"
          color="text-blue-600"
        />
        <StatCard
          title="Total Appointments"
          value={totalAppointments}
          icon="📅"
          color="text-green-600"
        />
        <StatCard
          title="Pending Appointments"
          value={pendingAppointments}
          icon="⏳"
          color="text-yellow-600"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon="💰"
          color="text-purple-600"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'appointments', 'patients', 'payments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Today's Appointments</h2>
            <div className="divide-y">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{appointment.patient_name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(`2000-01-01T${appointment.time}`), 'p')} -{' '}
                        {appointment.appointment_type}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
              {todayAppointments.length === 0 && (
                <p className="text-gray-500 text-center py-4">No appointments today</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
            <div className="divide-y">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{payment.patients?.name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(payment.created_at), 'PPP')}
                      </p>
                    </div>
                    <span className="font-medium text-gray-900">
                      {payment.currency} {Number(payment.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
              {recentPayments.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent payments</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && <AppointmentList />}
      {activeTab === 'patients' && <PatientList />}
      {activeTab === 'payments' && <PaymentList />}
    </div>
  );
};

export default AdminDashboard; 