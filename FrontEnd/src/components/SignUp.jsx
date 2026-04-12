import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiCalendar } from 'react-icons/fi';
import { Briefcase, CheckCircle, Zap, Shield, ArrowRight } from 'lucide-react';
import { handleSignUp as authSignUp } from '../services/auth';
import { toast } from 'react-toastify';

function SignUp({ onSwitchToSignIn }) {
  const navigate = useNavigate();
  const [role, setRole] = useState('applicant');
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
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      const signupData = {
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: password,
        phoneNumber: phone,
        dateOfBirth: dob,
        role: role === 'applicant' ? 'USER' : 'HRMANAGER'
      };

      const result = await authSignUp(signupData);

      if (result.success) {
        toast.success('Account created successfully! Please sign in.');
        if (onSwitchToSignIn) onSwitchToSignIn();
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-shadow";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
  const iconClass = "absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4";

  return (
    <div className="min-h-screen flex bg-white">
      {/* ════════ Left Panel - Branding ════════ */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-700 to-blue-800">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4"></div>
        <div className="absolute top-2/3 right-1/3 w-40 h-40 bg-white/5 rounded-full"></div>

        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="h-11 w-11 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white leading-none">HireHub</h1>
              <p className="text-[11px] text-blue-200 font-medium">Recruitment System</p>
            </div>
          </Link>

          {/* Main content */}
          <div className="my-auto">
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
              Start your journey<br />
              <span className="text-blue-200">with HireHub today.</span>
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-md leading-relaxed">
              Create your free account and unlock access to thousands of opportunities from world-class companies.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                { icon: Zap, text: "Get started in under 2 minutes" },
                { icon: CheckCircle, text: "Completely free for job seekers" },
                { icon: Shield, text: "Your data is secure and private" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-blue-200" />
                    </div>
                    <span className="text-blue-100 text-sm font-medium">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <p className="text-blue-300 text-xs">&copy; {new Date().getFullYear()} HireHub. All rights reserved.</p>
        </div>
      </div>

      {/* ════════ Right Panel - Form ════════ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-10 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">HireHub</h1>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-500">
              Already have an account?{" "}
              <button
                onClick={onSwitchToSignIn}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex mb-6 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 p-1">
            <button
              type="button"
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                role === 'applicant'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setRole('applicant')}
            >
              🔍 Job Seeker
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                role === 'hr'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setRole('hr')}
            >
              🏢 HR Manager
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSignUp}>
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>First Name</label>
                <div className="relative">
                  <FiUser className={iconClass} />
                  <input type="text" className={inputClass} placeholder="John" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <div className="relative">
                  <FiUser className={iconClass} />
                  <input type="text" className={inputClass} placeholder="Doe" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <FiMail className={iconClass} />
                <input type="email" className={inputClass} placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            {/* Gender & DOB row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Gender</label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-shadow text-gray-700"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="" disabled>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Date of Birth</label>
                <div className="relative">
                  <FiCalendar className={iconClass} />
                  <input type="date" className={inputClass} value={dob} onChange={(e) => setDob(e.target.value)} required />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Phone Number</label>
              <div className="relative">
                <FiPhone className={iconClass} />
                <input type="tel" className={inputClass} placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <FiLock className={iconClass} />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-shadow"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}>
                    {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <FiLock className={iconClass} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-shadow"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowConfirmPassword((v) => !v)} tabIndex={-1}>
                    {showConfirmPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{" "}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;