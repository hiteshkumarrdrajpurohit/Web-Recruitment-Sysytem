import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../App';
import { Briefcase } from 'lucide-react';

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // This will also clear localStorage
    navigate('/');
  };
  // Name and initials with better fallbacks (first+last -> name -> email prefix -> 'User')
  const first = (user?.firstName || '').trim();
  const last = (user?.lastName || '').trim();
  const emailPrefix = (user?.email || '').split('@')[0] || '';
  const displayName = (first || last)
    ? `${first}${last ? ' ' + last : ''}`
    : (user?.name || emailPrefix || 'User');
  const initials = (first || last)
    ? `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    : (user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : (emailPrefix.slice(0, 2).toUpperCase() || 'U'));

  return (
    <nav className="fixed top-0 w-full z-50 shadow-sm bg-white border-b px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* 1. Logo Section */}
      <div className="flex items-center flex-shrink-0">
        <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
          <Briefcase className="h-6 w-6 text-white" />
        </div>
        <div className="ml-2 flex flex-col">
          <h1 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">HireHub</h1>
          <p className="text-[10px] lg:text-xs text-gray-500 hidden sm:block">Recruitment System</p>
        </div>
      </div>

      {/* 2. Navigation Links (Center) */}
      <div className="hidden md:flex gap-4 lg:gap-6 items-center">
        <Link
          to="/applicantlayout/user/dashboard"
          className="font-medium text-sm lg:text-base text-gray-700 hover:text-blue-600 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/applicantlayout/user/jobs"
          className="font-medium text-sm lg:text-base text-gray-700 hover:text-blue-600 transition-colors"
        >
          Browse Jobs
        </Link>
        <Link
          to="/applicantlayout/user/applications"
          className="font-medium text-sm lg:text-base text-gray-700 hover:text-blue-600 transition-colors"
        >
          My Applications
        </Link>
        <Link
          to="/applicantlayout/user/interviews"
          className="font-medium text-sm lg:text-base text-gray-700 hover:text-blue-600 transition-colors"
        >
          My Interviews
        </Link>
        <Link
          to="/applicantlayout/user/profile"
          className="font-medium text-sm lg:text-base text-gray-700 hover:text-blue-600 transition-colors"
        >
          Profile
        </Link>
        <Link
          to="/applicantlayout/user/settings"
          className="font-medium text-sm lg:text-base text-gray-700 hover:text-blue-600 transition-colors"
        >
          Settings
        </Link>
      </div>

      {/* 3. User Profile & Logout (Right) */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-xs lg:text-sm font-semibold transition-colors"
        >
          Logout
        </button>
        <div className="flex items-center gap-2 border-l pl-4">
          {user?.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt="Profile" 
              className="h-8 w-8 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 border border-blue-200">
              {initials}
            </div>
          )}
          <span className="font-medium text-sm lg:text-base text-gray-700 hidden sm:block">
            {displayName}
          </span>
        </div>
      </div>
    </nav>
  );
}
