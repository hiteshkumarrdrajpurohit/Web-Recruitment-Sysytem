import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { Briefcase, CheckCircle, Users, BarChart3, ArrowRight } from 'lucide-react';
import { useAuth } from '../App';
import { handleSignIn as authSignIn } from '../services/auth';

function SignIn({ onSwitchToSignUp }) {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authSignIn(email, password);

      if (result.success) {
        let userRole = 'applicant';
        let userId = result.data.id;
        let userEmail = result.data.email;
        let firstName = result.data.firstName;
        let lastName = result.data.lastName;

        if (result.data.role === 'HRMANAGER') {
          userRole = 'hr';
        } else if (result.data.role === 'USER') {
          userRole = 'applicant';
        }

        const user = {
          id: userId,
          email: userEmail,
          role: userRole,
          firstName: firstName,
          lastName: lastName,
          token: result.data.token,
          profilePicture: result.data.profilePicture
        };

        setUser(user);

        if (userRole === 'hr') {
          navigate('/layout/dashboard');
        } else {
          navigate('/applicantlayout/user/dashboard');
        }
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* ════════ Left Panel - Branding ════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-white/5 rounded-full"></div>

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
              Welcome back.<br />
              <span className="text-blue-200">Let's pick up where you left off.</span>
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-md leading-relaxed">
              Sign in to access your dashboard, manage applications, and stay connected with top opportunities.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4">
              {[
                { icon: CheckCircle, text: "Track all your applications in one place" },
                { icon: Users, text: "Connect with top hiring managers" },
                { icon: BarChart3, text: "Get real-time insights on your progress" },
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
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">HireHub</h1>
            </Link>
          </div>

          {/* Header text */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Sign in to your account</h2>
            <p className="text-gray-500">
              Don't have an account?{" "}
              <button
                onClick={onSwitchToSignUp}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Create one free
              </button>
            </p>
          </div>

          {/* Info Banner */}
          <div className="mb-6 p-3.5 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm">💡</span>
            </div>
            <p className="text-blue-700 text-sm">
              Your account type is automatically detected at sign in.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSignIn}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-shadow"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-shadow"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
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
              className="w-full py-3 text-white rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;