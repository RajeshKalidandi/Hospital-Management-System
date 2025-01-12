import React, { useState } from 'react';
import { Calendar, Video, CreditCard, MessageSquare, Stethoscope, HeartPulse, MapPin, Phone, Mail } from 'lucide-react';

export function Home() {
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    appointmentType: '',
    date: '',
    time: '',
    consultationMode: '',
  });

  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in bookingData) {
      setBookingData(prev => ({ ...prev, [name]: value }));
    } else if (name in contactData) {
      setContactData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Booking submitted successfully! You will receive a confirmation via WhatsApp shortly.');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent successfully! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold text-blue-600">Healthcare Portal</div>
            <div className="flex items-center gap-6">
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <a
                href="https://wa.me/your-whatsapp-number"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-500 hover:text-green-600 transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Chat</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="bg-blue-50 py-2">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-blue-600">👋 Welcome! We're here to help you with your healthcare needs.</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Healthcare Made Simple</h1>
                <p className="text-xl mb-8">Book your medical appointment with experienced healthcare professionals.</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Book Appointment
                  </button>
                  <a
                    href="https://wa.me/your-whatsapp-number"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="h-5 w-5" />
                    Chat Now
                  </a>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-blue-700/30 p-8 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-lg text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Easy Scheduling</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg text-center">
                      <Video className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Video Consults</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg text-center">
                      <Stethoscope className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Expert Care</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg text-center">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">24/7 Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      
      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Our Services</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Comprehensive healthcare services tailored to your needs
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
              <Stethoscope className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">General Consultations</h3>
                <p className="text-gray-600">Expert medical consultations for all your health concerns. Available both in-person and via video call.</p>
            </div>
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
              <HeartPulse className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Specialist Care</h3>
                <p className="text-gray-600">Specialized treatment from experienced healthcare professionals in various fields.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
                <Video className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Video Consultations</h3>
                <p className="text-gray-600">Connect with healthcare professionals from the comfort of your home.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Video className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Online Consultations</h3>
                <p className="text-gray-600">Connect with healthcare professionals through secure video calls.</p>
              </div>
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">WhatsApp Support</h3>
                <p className="text-gray-600">Get instant assistance and appointment reminders via WhatsApp.</p>
              </div>
              <div className="text-center">
                <CreditCard className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Easy Payments</h3>
                <p className="text-gray-600">Secure online payments with multiple payment options.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gray-600 mb-6">
                We are committed to providing accessible, high-quality healthcare services to our community. Our mission is to make healthcare simple, convenient, and effective for everyone.
              </p>
              <p className="text-gray-600">
                With years of experience in healthcare services, we understand the importance of patient comfort and care. Our team of healthcare professionals is dedicated to providing the best possible care for all your health needs.
              </p>
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section id="booking-section" className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Book Your Appointment</h2>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between mb-8">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex items-center ${bookingStep >= step ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                      ${bookingStep >= step ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400'}`}
                    >
                      {step}
                    </div>
                    <span className="ml-2 font-medium">
                      {step === 1 ? 'Details' : step === 2 ? 'Schedule' : 'Payment'}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {bookingStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={bookingData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={bookingData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={bookingData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Appointment Type</label>
                      <select
                        name="appointmentType"
                        value={bookingData.appointmentType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="general">General Consultation</option>
                        <option value="specialist">Specialist Consultation</option>
                        <option value="followup">Follow-up Visit</option>
                      </select>
                    </div>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
                      <input
                        type="date"
                        name="date"
                        value={bookingData.date}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
                      <input
                        type="time"
                        name="time"
                        value={bookingData.time}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Consultation Mode</label>
                      <select
                        name="consultationMode"
                        value={bookingData.consultationMode}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select mode</option>
                        <option value="in-person">In-Person</option>
                        <option value="video">Video Consultation</option>
                      </select>
                    </div>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Booking Summary</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Name:</span> {bookingData.name}</p>
                        <p><span className="font-medium">Email:</span> {bookingData.email}</p>
                        <p><span className="font-medium">Phone:</span> {bookingData.phone}</p>
                        <p><span className="font-medium">Type:</span> {bookingData.appointmentType}</p>
                        <p><span className="font-medium">Date:</span> {bookingData.date}</p>
                        <p><span className="font-medium">Time:</span> {bookingData.time}</p>
                        <p><span className="font-medium">Mode:</span> {bookingData.consultationMode}</p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-2">Payment Details</h3>
                      {/* Integrate your payment form here */}
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          Payment integration would be implemented here based on your preferred payment gateway.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  {bookingStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setBookingStep(bookingStep - 1)}
                      className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  {bookingStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setBookingStep(bookingStep + 1)}
                      className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Complete Booking
                    </button>
                  )}
                </div>
              </form>
          </div>
        </div>
      </section>

        {/* Contact Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={contactData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={contactData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={contactData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                      name="message"
                      value={contactData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
              <div className="space-y-6">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=your-map-embed-url"
                    className="w-full h-64 rounded-lg"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-600">Your Location Address</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-600">+1234567890</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-600">contact@example.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600">WhatsApp: +1234567890</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#booking" className="text-gray-400 hover:text-white transition-colors">Book Appointment</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">General Consultations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Specialist Care</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Video Consultations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-gray-400">+1234567890</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-gray-400">contact@example.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-gray-400">WhatsApp: +1234567890</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">Monday - Friday: 9:00 AM - 8:00 PM</li>
                <li className="text-gray-400">Saturday: 9:00 AM - 6:00 PM</li>
                <li className="text-gray-400">Sunday: 10:00 AM - 4:00 PM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400">© 2025 Healthcare Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}