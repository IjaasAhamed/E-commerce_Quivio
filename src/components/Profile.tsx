import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Loading } from './Loading';
import placeholderImage from '../assets/placeholder-profile.png';
import EditProfileImg from '../assets/edit-profile.png';
import { warningToast } from './WarningToast';
import toast from 'react-hot-toast';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  mobile_number: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  profile_pic?: string;
}

export const Profile = () => {
  const API = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showProfileEditModal, setShowProfileEditModal] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [isProfilePicUpdateWindow, setIsProfilePicUpdateWindow] = useState(false);

  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isMobileFocused, setIsMobileFocused] = useState(false);
  const [isStreetFocused, setIsStreetFocused] = useState(false);
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [isStateFocused, setIsStateFocused] = useState(false);
  const [isZipFocused, setIsZipFocused] = useState(false);
  const [isCountryFocused, setIsCountryFocused] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('User not logged in.');
          setLoading(false);
          navigate("/login");
          return;
        }

        const response = await axios.get<UserProfile>(`${API}/users/${userId}`);
        setProfile(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    console.log("pro:", profile);
  }, []);

  const handleEditProfileBtn = () => {
    setShowProfileEditModal(true);
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setMobile(profile.mobile_number);
      setStreet(profile.street || '');
      setCity(profile.city || '');
      setState(profile.state || '');
      setZip(profile.zip || '');
      setCountry(profile.country || '');
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found in local storage.');
        warningToast('User ID not found. Please log in.');
        navigate("/login");
        return;
      }

      const response = await axios.put(`${API}/users/${userId}`, {
        name,
        email,
        mobile_number: mobile,
        street,
        city,
        state,
        zip,
        country,
      });

      console.log('Profile saved successfully!', response.data);
      toast.success('Profile Details saved successfully!');

      setProfile(response.data);
      setIsProfilePicUpdateWindow(true); // Move to the picture update step
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    }
  };

  const handleProfilePicUpdate = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found in local storage.');
        warningToast('User ID not found. Please log in.');
        navigate("/login");
        return;
      }

      if (!profilePic) {
        warningToast('Please select a profile picture.');
        return;
      }

      const formData = new FormData();
      formData.append('profile_pic', profilePic);

      const response = await axios.put(`${API}/users/${userId}/profile_pic`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Profile picture updated successfully!', response.data);
      setProfile(response.data);
      setShowProfileEditModal(false);
      setIsProfilePicUpdateWindow(false);
      setProfilePic(null);
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Failed to update profile picture. Please try again.');
    }
  };

  const handleSkipProfilePicUpdate = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found in local storage.');
        warningToast('User ID not found. Please log in.');
        navigate("/login");
        return;
      }

      setShowProfileEditModal(false);
      setIsProfilePicUpdateWindow(false);
      window.location.reload();
    } catch (error) {
      console.error('Error skipping profile picture update:', error);
      toast.error('Failed to skip profile picture update.');
    }
  };

  const handleCloseButton = () => {
    setShowProfileEditModal(false);
    setIsProfilePicUpdateWindow(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100" style={{ fontFamily: 'Poppins' }}>
          <p>Loading profile...</p>
          <div className="mt-4">
            <Loading />
          </div>
        </section>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <p className="text-red-500">{error}</p>
        </section>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 transition-all duration-300" style={{ fontFamily: 'Poppins' }}>
          <p>Profile not found.</p>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
    <style>
      {`
      @keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

      `}
    </style>
      <Navbar />
      <section className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 transition-all duration-300 px-5 md:px-0 pt-35 pb-20">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-semibold mb-6 text-center">Your Profile</h1>
          <div className="flex flex-col items-center mb-6">
            <img
              src={profile.profile_pic ? `${API}${profile.profile_pic}` : placeholderImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-300 rounded-lg bg-gray-50 p-5">
            <div className="border-b md:border-b-0 md:border-r border-gray-300 pb-5 md:pb-0">
              <h2 className="text-xl font-semibold mb-3">Personal Information</h2>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Mobile:</strong> {profile.mobile_number}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Address</h2>
              <p><strong>Street:</strong> {profile.street || 'Not provided'}</p>
              <p><strong>City:</strong> {profile.city || 'Not provided'}</p>
              <p><strong>State:</strong> {profile.state || 'Not provided'}</p>
              <p><strong>ZIP:</strong> {profile.zip || 'Not provided'}</p>
              <p><strong>Country:</strong> {profile.country || 'Not provided'}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button onClick={handleEditProfileBtn} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 cursor-pointer rounded">
              Edit Profile
            </button>
          </div>
        </div>
      </section>
      {/* Modal for Adding Address */}
      {showProfileEditModal && (
        <section
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-xs z-50"
          style={{ minHeight: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(10px)' }}
        >
          <div className="md:flex relative w-full sm:w-full md:w-[75%] lg:w-[55%] h-auto max-h-screen overflow-y-auto sm:overflow-y-auto md:overflow-visible px-15 md:px-0 py-2 md:py-0 shadow-none md:shadow-lg animate-fade-in">
            {/* Left Side */}
            <div className="w-full md:w-1/2 h-auto p-4 md:p-7 px-7 bg-[#0092fb] text-white">
              <h2 className="text-xl md:text-3xl my-2 md:my-4 font-semibold">{!isProfilePicUpdateWindow ? 'Edit Profile' : 'Update Profile Picture'}</h2>
              <p className="text-sm md:text-md text-gray-100">{!isProfilePicUpdateWindow ? 'Feel Free to Edit!' : 'Choose Your Profile Picture'}</p>
              <img src={EditProfileImg} alt="Edit Profile Image" className="w-75 h-auto object-contain mx-auto pt-15 filter drop-shadow-2xl hidden md:block" />
            </div>

            {/* Right Side */}
            {!isProfilePicUpdateWindow && (
              <div className="w-full md:w-1/2 p-7 bg-white">
                <div className="relative my-6">
                  <label
                    htmlFor="name"
                    className={`absolute left-0 px-1 bg-white transition-all cursor-text text-sm ${name || isNameFocused ? 'text-xs -top-3 text-[#0092fb]' : 'text-base top-3'
                      }`}
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setIsNameFocused(true)}
                    onBlur={(e) => !e.target.value && setIsNameFocused(false)}
                    className="w-full p-2 border-b transition-all text-sm focus:border-[#0092fb] focus:outline-none"
                  />
                </div>
                <div className="relative my-6">
                  <label
                    htmlFor="email"
                    className={`absolute left-0 px-1 bg-white transition-all cursor-text text-sm ${email || isEmailFocused ? 'text-xs -top-3 text-[#0092fb]' : 'text-base top-3'
                      }`}
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={(e) => !e.target.value && setIsEmailFocused(false)}
                    className="w-full p-2 border-b transition-all text-sm focus:border-[#0092fb] focus:outline-none"
                  />
                </div>
                <div className="relative my-6">
                  <label
                    htmlFor="mobile"
                    className={`absolute left-0 px-1 bg-white transition-all cursor-text text-sm ${mobile || isMobileFocused ? 'text-xs -top-3 text-[#0092fb]' : 'text-base top-3'
                      }`}
                  >
                    Mobile Number
                  </label>
                  <input
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    onFocus={() => setIsMobileFocused(true)}
                    onBlur={(e) => !e.target.value && setIsMobileFocused(false)}
                    className="w-full p-2 border-b transition-all text-sm focus:border-[#0092fb] focus:outline-none"
                  />
                </div>
                <div className="relative my-6">
                  <label
                    htmlFor="street"
                    className={`absolute left-0 px-1 bg-white transition-all cursor-text text-sm ${street || isStreetFocused ? 'text-xs -top-3 text-[#0092fb]' : 'text-base top-3'
                      }`}
                  >
                    Enter Street
                  </label>
                  <input
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    onFocus={() => setIsStreetFocused(true)}
                    onBlur={(e) => !e.target.value && setIsStreetFocused(false)}
                    className="w-full p-2 border-b transition-all text-sm focus:border-[#0092fb] focus:outline-none"
                  />
                </div>
                <div className="relative my-6">
                  <label
                    htmlFor="city"
                    className={`absolute left-0 px-1 bg-white transition-all cursor-text text-sm ${city || isCityFocused ? 'text-xs -top-3 text-[#0092fb]' : 'text-base top-3'
                      }`}
                  >
                    Enter City
                  </label>
                  <input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onFocus={() => setIsCityFocused(true)}
                    onBlur={(e) => !e.target.value && setIsCityFocused(false)}
                    className="w-full p-2 border-b transition-all text-sm focus:border-[#0092fb] focus:outline-none"
                  />
                </div>
                <div className="relative my-6">
                  <label
                    htmlFor="state"
                    className={`absolute left-0 px-1 bg-white transition-all cursor-text text-sm ${state || isStateFocused ? 'text-xs -top-3 text-[#0092fb]' : 'text-base top-3'
                      }`}
                  >
                    Enter State
                  </label>
                  <input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    onFocus={() => setIsStateFocused(true)}
                    onBlur={(e) => !e.target.value && setIsStateFocused(false)}
                    className="w-full p-2 border-b transition-all text-sm focus:border-[#0092fb] focus:outline-none"
                  />
                </div>
                <div className="relative my-6">
                  <label
                    htmlFor="zip"
                    className={`absolute left-0 px-1 bg-white transition-all cursor-text text-sm ${zip || isZipFocused ? 'text-xs -top-3 text-[#0092fb]' : 'text-base top-3'
                      }`}
                  >
                    Enter Zip
                  </label>
                  <input
                    id="zip"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    onFocus={() => setIsZipFocused(true)}
                    onBlur={(e) => !e.target.value && setIsZipFocused(false)}
                    className="w-full p-2 border-b transition-all text-sm focus:border-[#0092fb] focus:outline-none"
                  />
                </div>
                <div className="relative my-6">
                  <label
                    htmlFor="country"
                    className={`absolute left-0 px-1 bg-white transition-all cursor-text text-sm ${country || isCountryFocused ? 'text-xs -top-3 text-[#0092fb]' : 'text-base top-3'
                      }`}
                  >
                    Enter Country
                  </label>
                  <input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    onFocus={() => setIsCountryFocused(true)}
                    onBlur={(e) => !e.target.value && setIsCountryFocused(false)}
                    className="w-full p-2 border-b transition-all text-sm focus:border-[#0092fb] focus:outline-none"
                  />
                </div>

                <button onClick={handleProfileUpdate} className="bg-[#0092fb] text-white mt-3 p-2 rounded-md w-full cursor-pointer">
                  Continue
                </button>
              </div>
            )}
            {isProfilePicUpdateWindow && (
              <div className="w-full md:w-1/2 p-7 bg-white shadow-md">
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-xl font-semibold text-gray-800 my-6">Update Profile Picture</h3>
                  <p className='my-2 text-sm'>Image uploads must not exceed 10MB.</p>

                  {profilePic ? (
                    <div className="relative mb-6">
                      <img
                        src={URL.createObjectURL(profilePic)}
                        alt="Preview"
                        className="w-40 h-40 object-cover rounded-full border-2 border-blue-200"
                      />
                      <button
                        onClick={() => setProfilePic(null)}
                        className="absolute top-4 right-5 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2 shadow-md hover:bg-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="mb-6 relative">
                      <label
                        htmlFor="profilePic"
                        className="inline-flex items-center justify-center px-4 py-2 border border-[#0092fb] rounded-md shadow-sm text-sm font-medium text-[#0092fb] bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0092fb] cursor-pointer"
                      >
                        Choose Picture
                      </label>
                      <input
                        id="profilePic"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setProfilePic(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  )}

                  {profilePic && (
                    <button
                      onClick={handleProfilePicUpdate}
                      className="w-full px-4 py-2 mb-15 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0092fb] hover:bg-[#0077d9] focus:outline-none cursor-pointer"
                    >
                      Upload Picture
                    </button>
                  )}
                </div>
                <div>
                  <button onClick={handleSkipProfilePicUpdate} className='skipbtn'>Skip →</button>
                </div>
              </div>
            )}
            <button onClick={handleCloseButton} className="cls-btn1"></button>
          </div>
          <div>

          </div>
        </section>
      )}
      <Footer />
    </>
  );
};