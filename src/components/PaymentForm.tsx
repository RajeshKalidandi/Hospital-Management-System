import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentFormProps {
  amount: number;
  currency: string;
  appointmentId: string;
  patientId: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

// Stripe Payment Form Component
const StripePaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  appointmentId,
  patientId,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Create payment intent
      const response = await fetch('/api/payment-gateway/stripe/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          appointmentId,
          patientId,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        onError(result.error.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (error) {
      onError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
          className="p-3 border rounded-md"
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay ${currency} ${amount}`}
      </button>
    </form>
  );
};

// Razorpay Payment Component
const RazorpayPayment: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  appointmentId,
  patientId,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Create order
      const response = await fetch('/api/payment-gateway/razorpay/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          appointmentId,
          patientId,
        }),
      });

      const { orderId } = await response.json();

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency,
        name: 'Healthcare Clinic',
        description: 'Appointment Payment',
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment-gateway/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const { status } = await verifyResponse.json();
            if (status === 'success') {
              onSuccess();
            } else {
              onError('Payment verification failed');
            }
          } catch (error) {
            onError('Payment verification failed');
          }
        },
        prefill: {
          name: 'Patient Name',
          email: 'patient@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#2563eb',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      onError('Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay ${currency} ${amount} with Razorpay`}
      </button>
    </div>
  );
};

// Main Payment Form Component
const PaymentForm: React.FC<PaymentFormProps & { paymentMethod: 'stripe' | 'razorpay' }> = ({
  paymentMethod,
  ...props
}) => {
  if (paymentMethod === 'stripe') {
    return (
      <Elements stripe={stripePromise}>
        <StripePaymentForm {...props} />
      </Elements>
    );
  }

  return <RazorpayPayment {...props} />;
};

export default PaymentForm; 