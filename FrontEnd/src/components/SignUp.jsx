import React, { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import { handleSignUp as authSignUp } from '../services/auth';
import { toast } from 'react-toastify';

const BG_IMG = "../assets/bg.jpg";
function SignUp({ onSwitchToSignIn, onSignUp }) {

    const [role, setRole] = useState('applicant'); // Make role dynamic
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!firstname || !lastname || !gender || !dob || !phone || !email || !password || !confirmPassword) {
            setError('Please fill all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Create signup data object matching backend DTO
            const signupData = {
                firstName: firstname,
                lastName: lastname,
                email: email,
                password: password,
                phoneNumber: phone,
                dateOfBirth: dob,
                role: role === 'applicant' ? 'USER' : 'HRMANAGER' // Map frontend role to backend role
            };

            const result = await authSignUp(signupData);
            
            if (result.success) {
                // Show success message and switch to sign in
                toast.success('Account created successfully! Please sign in.');
                if (onSwitchToSignIn) onSwitchToSignIn();
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError('Registration failed. Please try again.');
        }
    };


    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
                <img src={BG_IMG} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-50" />
            </div>

            {/* Navbar */}
            <nav className="absolute top-0 left-0 w-full z-10 flex items-center justify-between px-8 py-4 bg-black bg-opacity-60 backdrop-blur-sm">
                <div className="flex items-center">
                    <span className="text-white text-2xl font-bold tracking-wide">HireHub</span>
                </div>
            </nav>

            {/* Sign Up Card */}
            <div className="relative z-10 w-full max-w-md">

                <div className="flex flex-col items-center mb-8">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-white"> <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg> </span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-white">Create an Account</h2>
                    <p className="text-gray-200 mb-4">
                      {role === 'applicant' ? 'Sign up to start your job search' : 'Sign up to manage job postings and recruitment'}
                    </p>

                </div>
                <form
          className="bg-white rounded-xl shadow p-8 flex flex-col gap-4"
          onSubmit={handleSignUp}
        >

          {/* Role Toggle */}
          <div className="flex mb-4 rounded-lg overflow-hidden border border-gray-200">
            <button
              type="button"
              className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${
                role === 'applicant' 
                  ? 'bg-blue-50 text-blue-700 border-r border-gray-200' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setRole('applicant')}
            >
              🔍 Job Seeker
            </button>
            <button
              type="button"
              className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${
                role === 'hr' 
                  ? 'bg-blue-50 text-blue-700 border-l border-gray-200' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setRole('hr')}
            >
              🏢 HR Manager
            </button>
          </div>
          <div>
            <label className="block mb-1 font-medium">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded bg-gray-50 focus:outline-none"
                placeholder="Enter your name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded bg-gray-50 focus:outline-none"
                placeholder="Enter your name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block mb-1 font-medium">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full pl-3 pr-4 py-2 border rounded bg-gray-50 focus:outline-none"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="" disabled>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2 border rounded bg-gray-50 focus:outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border rounded bg-gray-50 focus:outline-none"
                placeholder="Enter your email"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                className="w-full pl-10 pr-4 py-2 border rounded bg-gray-50 focus:outline-none"
                placeholder="Enter your email"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-2 border rounded bg-gray-50 focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-2 border rounded bg-gray-50 focus:outline-none"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowConfirmPassword((v) => !v)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 mt-2 text-white rounded font-semibold bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow"
          >
            Sign Up
          </button>
          <div className="text-center mt-2">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={onSwitchToSignIn}
            >
              Already have an account?{" "}
              <span className="font-semibold">Sign in</span>
            </button>
          </div>
        </form>
            </div>
        </div>


    )






}

export default SignUp;