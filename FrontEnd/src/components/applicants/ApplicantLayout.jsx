import React from 'react';

import ApplicantNavbar from './ApplicantNavbar';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';


const ApplicantLayout = ({ children }) => {

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden bg-gray-50">
            {/* Static Navbar */}
            <ApplicantNavbar />
            {/* Main Content */}
            <div className="flex-1 flex flex-col pt-[72px] pb-6">
                {/* Page content */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-2 px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ApplicantLayout;