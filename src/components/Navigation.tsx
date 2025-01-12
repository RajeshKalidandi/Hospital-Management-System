import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Calendar, Phone, User } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">SmallClinic</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/appointments" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <Calendar className="h-5 w-5" />
              <span>Appointments</span>
            </Link>
            <Link to="/contact" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <Phone className="h-5 w-5" />
              <span>Contact</span>
            </Link>
            <Link to="/login" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <User className="h-5 w-5" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}