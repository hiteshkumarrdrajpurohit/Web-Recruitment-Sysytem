import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../App';
import { handleSignIn as authSignIn } from '../services/auth';



const BG_IMG= "../";
function SignIn({ onSwitchToForgetPassword,onSwitchToSignUp }) {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  {/* state variables */}
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      
      const result = await authSignIn(email, password);
      
      if (result.success) {
        // Get user details directly from backend response
        let userRole = 'applicant'; // default
        let userId = result.data.id;
        let userEmail = result.data.email;
        let firstName = result.data.firstName;
        let lastName = result.data.lastName;
        
        // Map backend role to frontend role
        if (result.data.role === 'HRMANAGER') {
          userRole = 'hr';
        } else if (result.data.role === 'USER') {
          userRole = 'applicant';
        }
        
        // Create user object from backend response
        const user = {
          id: userId,
          email: userEmail,
          role: userRole,
          firstName: firstName,
          lastName: lastName,
          token: result.data.token
        };
        
        setUser(user);
        
        // Navigate based on actual user role
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
    }
  };
  return (
     <div className="relative min-h-screen flex flex-col justify-center items-center"> 

     {/* background image */}

     <div className="absolute inset-0 z-0">
      <img src={BG_IMG} alt="background" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-50" /> 
     </div>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 flex items-center justify-between px-8 py-4 bg-black bg-opacity-60 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span className="text-white text-2xl font-bold tracking-wide">HireHub</span>
         
        </div>
      </nav>
   {/* Sign In Card */}

<div className="relative z-10 w-full max-w-md">

<div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white"> <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg> </span>
          </div>
          <h2 className="text-3xl font-bold mb-2 text-white">Welcome To HireHub</h2>
          <p className="text-gray-200 mb-4">Sign in to your account</p>
</div>


<form className="bg-white rounded-xl shadow p-8 flex flex-col gap-4" onSubmit={handleSignIn}>
          {/* Info Banner */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm text-center">
              💡 Your account type (Job Seeker or HR Manager) is automatically detected
            </p>
          </div>
          <div>
            <label className="block mb-1 font-medium">Email Address <span className="text-red-500">*</span></label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2 border rounded bg-gray-50 focus:outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full pl-10 pr-10 py-2 border rounded bg-gray-50 focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
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
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 mt-2 text-white rounded font-semibold bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow"
            
          >
            Sign In
          </button>
          <div className="text-center mt-2">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
              onClick={onSwitchToSignUp}
            >
              Don't have an account?  <span className="font-semibold">  Sign up</span> 
            </button>
          </div>
          <div className="text-center mt-2">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
                onClick={() => navigate('/forgot-password')}
              >
                Forget Your password?  <span className="font-semibold"> Click here</span> 
              </button>
          </div>
         
    </form>
     </div>
   </div>
  );

}


export default SignIn;