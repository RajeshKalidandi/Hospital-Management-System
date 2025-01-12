import React, { useState } from 'react';
import { User, Lock, Bell, Clock, Video, CreditCard } from 'lucide-react';

interface AdminSettings {
  notifications: {
    emailNotifications: boolean;
    whatsappNotifications: boolean;
    appointmentReminders: boolean;
  };
  scheduling: {
    workingHours: {
      start: string;
      end: string;
    };
    appointmentDuration: number;
    bufferTime: number;
  };
  videoConsultation: {
    provider: 'google-meet' | 'zoom';
    automaticLinkGeneration: boolean;
  };
  payment: {
    currency: string;
    defaultConsultationFee: number;
    paymentGateway: string;
  };
}

export function Settings() {
  const [settings, setSettings] = useState<AdminSettings>({
    notifications: {
      emailNotifications: true,
      whatsappNotifications: true,
      appointmentReminders: true,
    },
    scheduling: {
      workingHours: {
        start: '09:00',
        end: '17:00',
      },
      appointmentDuration: 30,
      bufferTime: 10,
    },
    videoConsultation: {
      provider: 'google-meet',
      automaticLinkGeneration: true,
    },
    payment: {
      currency: 'USD',
      defaultConsultationFee: 100,
      paymentGateway: 'stripe',
    },
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSettingsChange = (section: keyof AdminSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password change logic
    console.log('Change password');
  };

  const handleSaveSettings = () => {
    // Implement settings save logic
    console.log('Save settings:', settings);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Settings</h1>
        <button
          onClick={handleSaveSettings}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile & Security */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Profile & Security</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Change Password
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-400 mr-3" />
                <label className="text-sm font-medium text-gray-700">Email Notifications</label>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => handleSettingsChange('notifications', 'emailNotifications', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-400 mr-3" />
                <label className="text-sm font-medium text-gray-700">WhatsApp Notifications</label>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.whatsappNotifications}
                onChange={(e) => handleSettingsChange('notifications', 'whatsappNotifications', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-400 mr-3" />
                <label className="text-sm font-medium text-gray-700">Appointment Reminders</label>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.appointmentReminders}
                onChange={(e) => handleSettingsChange('notifications', 'appointmentReminders', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Scheduling */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Scheduling</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Working Hours Start</label>
                <input
                  type="time"
                  value={settings.scheduling.workingHours.start}
                  onChange={(e) => handleSettingsChange('scheduling', 'workingHours', { ...settings.scheduling.workingHours, start: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Working Hours End</label>
                <input
                  type="time"
                  value={settings.scheduling.workingHours.end}
                  onChange={(e) => handleSettingsChange('scheduling', 'workingHours', { ...settings.scheduling.workingHours, end: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Appointment Duration (minutes)</label>
              <input
                type="number"
                value={settings.scheduling.appointmentDuration}
                onChange={(e) => handleSettingsChange('scheduling', 'appointmentDuration', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Buffer Time Between Appointments (minutes)</label>
              <input
                type="number"
                value={settings.scheduling.bufferTime}
                onChange={(e) => handleSettingsChange('scheduling', 'bufferTime', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Video Consultation */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Video Consultation</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Video Provider</label>
              <select
                value={settings.videoConsultation.provider}
                onChange={(e) => handleSettingsChange('videoConsultation', 'provider', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="google-meet">Google Meet</option>
                <option value="zoom">Zoom</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Video className="h-5 w-5 text-gray-400 mr-3" />
                <label className="text-sm font-medium text-gray-700">Automatic Link Generation</label>
              </div>
              <input
                type="checkbox"
                checked={settings.videoConsultation.automaticLinkGeneration}
                onChange={(e) => handleSettingsChange('videoConsultation', 'automaticLinkGeneration', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select
                value={settings.payment.currency}
                onChange={(e) => handleSettingsChange('payment', 'currency', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Consultation Fee</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={settings.payment.defaultConsultationFee}
                  onChange={(e) => handleSettingsChange('payment', 'defaultConsultationFee', parseFloat(e.target.value))}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Gateway</label>
              <select
                value={settings.payment.paymentGateway}
                onChange={(e) => handleSettingsChange('payment', 'paymentGateway', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="stripe">Stripe</option>
                <option value="razorpay">Razorpay</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 