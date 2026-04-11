import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "./ApplicantNavbar";
import { getProfile, updateProfile } from '../../services/applicant';
import { toast } from 'react-toastify';
import { useAuth } from '../../App';

export default function ApplicantProfile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const result = await getProfile();
      
      if (result.success) {
        const profileData = result.data;
        setProfile(profileData);
        
        // Initialize form with profile data
        setForm({
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          email: profileData.email || '',
          phoneNumber: profileData.phoneNumber || '',
          dateOfBirth: profileData.dateOfBirth || '',
          skills: profileData.skills || '',
          address: profileData.address || '',
          city: profileData.city || '',
          state: profileData.state || '',
          country: profileData.country || '',
          zipCode: profileData.zipCode || '',
          orgName: profileData.orgName || '',
          designation: profileData.designation || '',
          startDate: profileData.startDate || '',
          endDate: profileData.endDate || '',
          summary: profileData.summary || '',
          profilePicture: profileData.profilePicture || ''
        });
      } else {
        setError(result.error || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setForm((prev) => ({ ...prev, profilePicture: base64Image }));
        
        // If not editing, instantly trigger a background save for the photo
        if (!editing) {
          try {
            toast.info("Uploading photo...");
            const currentForm = { ...form, profilePicture: base64Image };
            const result = await updateProfile(currentForm);
            if (result.success) {
              if (user) {
                setUser({ ...user, profilePicture: base64Image });
              }
              await loadProfile();
              toast.success("Profile photo updated!");
            } else {
              toast.error("Failed to save photo");
            }
          } catch (err) {
             toast.error("Error saving photo");
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await updateProfile(form);
      
      if (result.success) {
        // Update global user context with new profile picture
        if (form.profilePicture && form.profilePicture !== user?.profilePicture) {
          const updatedUser = { ...user, profilePicture: form.profilePicture };
          setUser(updatedUser);
        }
        
        // Reload profile to get updated data
        await loadProfile();
        setEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No profile data
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No profile data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto mt-2">
        <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
          <div className="relative mb-4 group cursor-pointer">
            <label className="cursor-pointer block relative">
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              {form.profilePicture || profile?.profilePicture || user?.profilePicture ? (
                <img 
                  src={form.profilePicture || profile?.profilePicture || user?.profilePicture} 
                  alt="Profile" 
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md mx-auto group-hover:opacity-80 transition" 
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-blue-200 flex items-center justify-center text-4xl font-bold text-blue-700 shadow-md mx-auto group-hover:opacity-80 transition">
                  {profile.firstName ? profile.firstName[0].toUpperCase() : 'U'}
                </div>
              )}
              
              <div title="Upload Photo" className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 shadow-lg hover:bg-blue-700 transition">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
            </label>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 w-full">
              {error}
            </div>
          )}

          {editing ? (
            <form className="w-full" onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
                {/* Personal Information */}
                <div>
                  <h3 className="font-bold text-lg mb-4 border-b pb-2">
                    Personal Information
                  </h3>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">Email</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">
                      Phone Number
                    </label>
                    <input
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">
                      Skills (comma separated)
                    </label>
                    <input
                      name="skills"
                      value={form.skills}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                </div>

                {/* Address and Work Experience */}
                <div>
                  <h3 className="font-bold text-lg mb-4 border-b pb-2">
                    Address Information
                  </h3>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">Address</label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      rows="3"
                      placeholder="Enter your full address"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">City</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">State</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">ZIP Code</label>
                    <input
                      name="zipCode"
                      value={form.zipCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">Country</label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>

                  <h3 className="font-bold text-lg mb-4 mt-6 border-b pb-2">
                    Work Experience
                  </h3>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">
                      Organization Name
                    </label>
                    <input
                      name="orgName"
                      value={form.orgName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">
                      Designation
                    </label>
                    <input
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">Summary</label>
                    <textarea
                      name="summary"
                      value={form.summary}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      rows="3"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center mt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-semibold hover:bg-gray-300"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-1">
                {profile.firstName} {profile.lastName}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-6">
                {/* Personal Information */}
                <div>
                  <h3 className="font-bold text-lg mb-4 border-b pb-2">
                    Personal Information
                  </h3>
                  <div className="mb-2">
                    <span className="font-semibold">Email:</span>{" "}
                    {profile.email}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Phone:</span>{" "}
                    {profile.phoneNumber}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Date of Birth:</span>{" "}
                    {profile.dateOfBirth}
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold block mb-2">Skills:</span>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills ? (
                        profile.skills.split(',').map((skill, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                          >
                            {skill.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">No skills added</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="font-bold text-lg mb-4 border-b pb-2">
                    Address Information
                  </h3>
                  <div className="mb-2">
                    <span className="font-semibold">Address:</span>{" "}
                    {profile.address || 'Not provided'}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">City:</span> {profile.city || 'Not provided'}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">State:</span>{" "}
                    {profile.state || 'Not provided'}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">ZIP:</span> {profile.zipCode || 'Not provided'}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Country:</span>{" "}
                    {profile.country || 'Not provided'}
                  </div>
                </div>

                {/* Work Experience */}
                <div className="md:col-span-2">
                  <h3 className="font-bold text-lg mb-4 border-b pb-2">
                    Work Experience
                  </h3>
                  <div className="mb-2">
                    <span className="font-semibold">Organization:</span>{" "}
                    {profile.orgName || 'Not provided'}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Designation:</span>{" "}
                    {profile.designation || 'Not provided'}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Duration:</span>{" "}
                    {profile.startDate || 'Not provided'} to {profile.endDate || 'Not provided'}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Summary:</span>{" "}
                    {profile.summary || 'Not provided'}
                  </div>
                </div>
              </div>

              <button
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
                onClick={() => setEditing(true)}
              >
                Update Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
