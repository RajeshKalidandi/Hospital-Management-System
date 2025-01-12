import React, { useState } from 'react';
import { Video, Calendar, Mail, MessageSquare, Link as LinkIcon } from 'lucide-react';

interface VideoConsultation {
  id: number;
  patientName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  meetLink?: string;
}

export function VideoConsultations() {
  const [filter, setFilter] = useState('all');

  // Replace with actual data from your backend
  const consultations: VideoConsultation[] = [
    {
      id: 1,
      patientName: 'John Doe',
      date: '2024-03-15',
      time: '10:00 AM',
      status: 'scheduled',
      meetLink: 'https://meet.google.com/abc-defg-hij',
    },
    // Add more sample data
  ];

  const handleCreateMeeting = async (id: number) => {
    // Implement Google Meet API integration
    console.log('Create meeting for:', id);
  };

  const handleSendInvite = async (id: number, type: 'email' | 'whatsapp') => {
    // Implement sending meeting details
    console.log('Send invite via:', type, 'for:', id);
  };

  const getStatusBadgeColor = (status: VideoConsultation['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Video Consultations</h1>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Video Consultations Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meeting Link
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consultations.map((consultation) => (
                <tr key={consultation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{consultation.patientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {consultation.date} at {consultation.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(consultation.status)}`}>
                      {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {consultation.meetLink ? (
                      <a
                        href={consultation.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-900"
                      >
                        <LinkIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm">Join Meeting</span>
                      </a>
                    ) : (
                      <button
                        onClick={() => handleCreateMeeting(consultation.id)}
                        className="flex items-center text-blue-600 hover:text-blue-900"
                      >
                        <Video className="h-4 w-4 mr-1" />
                        <span className="text-sm">Create Meeting</span>
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleSendInvite(consultation.id, 'email')}
                        className="text-blue-600 hover:text-blue-900"
                        title="Send Email Invite"
                      >
                        <Mail className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleSendInvite(consultation.id, 'whatsapp')}
                        className="text-green-600 hover:text-green-900"
                        title="Send WhatsApp Invite"
                      >
                        <MessageSquare className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions Panel */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Video Consultation Instructions</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
          <li>Ensure you have a stable internet connection</li>
          <li>Test your camera and microphone before the consultation</li>
          <li>Click "Join Meeting" 5 minutes before the scheduled time</li>
          <li>Have the patient's medical records ready for reference</li>
          <li>In case of technical issues, contact IT support immediately</li>
        </ul>
      </div>
    </div>
  );
} 