import React, { useState } from 'react';
import { MessageSquare, Check, X, Calendar, Clock } from 'lucide-react';

interface WhatsAppBooking {
  id: number;
  phone: string;
  name: string;
  requestedDate: string;
  requestedTime: string;
  type: string;
  status: 'new' | 'processing' | 'confirmed' | 'rejected';
  message: string;
  timestamp: string;
}

export function WhatsAppBookings() {
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<WhatsAppBooking | null>(null);

  // Replace with actual data from your backend
  const bookings: WhatsAppBooking[] = [
    {
      id: 1,
      phone: '+1234567890',
      name: 'John Doe',
      requestedDate: '2024-03-15',
      requestedTime: '10:00 AM',
      type: 'General Consultation',
      status: 'new',
      message: 'I would like to book an appointment for a general checkup.',
      timestamp: '2024-03-14 15:30:00',
    },
    // Add more sample data
  ];

  const handleStatusUpdate = (id: number, status: WhatsAppBooking['status']) => {
    // Implement status update logic
    console.log('Update status:', id, status);
  };

  const handleSendMessage = (phone: string, message: string) => {
    // Implement WhatsApp message sending logic
    console.log('Send message to:', phone, message);
  };

  const getStatusBadgeColor = (status: WhatsAppBooking['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">WhatsApp Bookings</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="processing">Processing</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings List */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                        <div className="text-sm text-gray-500">{booking.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.type}</div>
                        <div className="text-sm text-gray-500">
                          {booking.requestedDate} at {booking.requestedTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          {booking.status === 'new' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(booking.id, 'confirmed');
                                }}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(booking.id, 'rejected');
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="bg-white shadow rounded-lg">
          {selectedBooking ? (
            <div className="h-full flex flex-col">
              <div className="px-4 py-3 border-b">
                <h3 className="text-lg font-medium text-gray-900">{selectedBooking.name}</h3>
                <p className="text-sm text-gray-500">{selectedBooking.phone}</p>
              </div>
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Patient's Message */}
                <div className="flex items-start">
                  <div className="flex-1 bg-gray-100 rounded-lg p-3">
                    <p className="text-sm">{selectedBooking.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{selectedBooking.timestamp}</p>
                  </div>
                </div>

                {/* Quick Replies */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleSendMessage(selectedBooking.phone, 'Your appointment has been confirmed.')}
                    className="w-full text-left text-sm text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50"
                  >
                    ✓ Send Confirmation
                  </button>
                  <button
                    onClick={() => handleSendMessage(selectedBooking.phone, 'Please provide your preferred time for rescheduling.')}
                    className="w-full text-left text-sm text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50"
                  >
                    🕒 Request Reschedule
                  </button>
                  <button
                    onClick={() => handleSendMessage(selectedBooking.phone, 'Please provide any additional medical information.')}
                    className="w-full text-left text-sm text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50"
                  >
                    📋 Request More Info
                  </button>
                </div>
              </div>
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                <p>Select a booking to view the conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 