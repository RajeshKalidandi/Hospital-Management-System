import React, { useState } from 'react';
import { usePayments } from '../hooks/useRealTimeData';
import { format } from 'date-fns';
import { paymentService } from '../services/api';

const PaymentList: React.FC = () => {
  const { data: payments, isLoading, error } = usePayments();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPayments = payments?.filter((payment) =>
    statusFilter === 'all' ? true : payment.status === statusFilter
  );

  const totalAmount = filteredPayments?.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
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
        Error loading payments
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Payments</h2>
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <div className="text-sm text-gray-600">
              Total: {filteredPayments?.[0]?.currency || 'USD'}{' '}
              {totalAmount?.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      <div className="divide-y">
        {filteredPayments?.map((payment) => (
          <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">
                  {payment.patients?.name || 'Unknown Patient'}
                </h3>
                <p className="text-sm text-gray-600">
                  {payment.appointments?.appointment_type} -{' '}
                  {format(new Date(payment.created_at), 'PPP')}
                </p>
                <p className="text-sm text-gray-500">
                  {payment.payment_method} - {payment.transaction_id}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-lg font-medium text-gray-900">
                  {payment.currency} {Number(payment.amount).toFixed(2)}
                </div>
                <select
                  value={payment.status}
                  onChange={async (e) => {
                    try {
                      await paymentService.updateStatus(payment.id, e.target.value);
                    } catch (error) {
                      console.error('Error updating payment status:', error);
                    }
                  }}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    payment.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : payment.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : payment.status === 'refunded'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
            {payment.description && (
              <p className="mt-2 text-sm text-gray-500">{payment.description}</p>
            )}
          </div>
        ))}
        {filteredPayments?.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No payments found
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentList; 