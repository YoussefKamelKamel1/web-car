import React, { useState } from 'react';
import { ChevronLeft, Mail, Phone, MapPin, Heart, Edit2, LogOut } from 'lucide-react';

const Profile = ({ setCurrentPage, user, setUser, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    location: 'Los Angeles, CA',
    joinDate: 'January 2024',
    bio: 'Luxury car enthusiast and collector'
  });

  const [favoritesCount, setFavoritesCount] = useState(0);

  // Load profile from backend when user is present
  React.useEffect(() => {
    if (!user || !user.email) return;
    const email = encodeURIComponent(user.email);
    fetch(`http://localhost:5000/api/users/${email}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setProfile(prev => ({ ...prev, ...json.data }));
        }
      })
      .catch(() => {})
      .finally(() => {});

    // fetch favorites count
    fetch(`http://localhost:5000/api/favorites/${email}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) setFavoritesCount(json.data.length);
      })
      .catch(() => {});
  }, [user]);

  const [editForm, setEditForm] = useState(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(profile);
  };

  const handleSave = () => {
    // Save to backend
    fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editForm.name, email: editForm.email, phone: editForm.phone, location: editForm.location, bio: editForm.bio })
    })
      .then(async res => {
        const json = await res.json().catch(() => ({}));
        if (res.ok) {
          setProfile(editForm);
          if (setUser) setUser({ name: editForm.name, email: editForm.email });
        }
        return json;
      })
      .catch(() => {
        setProfile(editForm);
      })
      .finally(() => setIsEditing(false));
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <button 
          onClick={() => setCurrentPage('home')}
          className="flex items-center mb-8 hover:text-gray-600 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="ml-2">Back</span>
        </button>

        <div className="border-2 border-black p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">My Profile</h1>
            {!isEditing && (
              <button 
                onClick={handleEdit}
                className="flex items-center bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-black"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-black"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Phone</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={editForm.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-black"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Location</label>
                <input 
                  type="text" 
                  name="location"
                  value={editForm.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-black"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Bio</label>
                <textarea 
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-black"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={handleSave}
                  className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition"
                >
                  Save Changes
                </button>
                <button 
                  onClick={handleCancel}
                  className="border-2 border-black px-8 py-3 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-b-2 border-gray-200 pb-4">
                <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
                <p className="text-gray-600">{profile.bio}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <Mail className="w-5 h-5 mr-3 text-gray-600" />
                      <span className="text-gray-600 text-sm">Email</span>
                    </div>
                    <p className="text-lg font-medium ml-8">{profile.email}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Phone className="w-5 h-5 mr-3 text-gray-600" />
                      <span className="text-gray-600 text-sm">Phone</span>
                    </div>
                    <p className="text-lg font-medium ml-8">{profile.phone}</p>
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-5 h-5 mr-3 text-gray-600" />
                      <span className="text-gray-600 text-sm">Location</span>
                    </div>
                    <p className="text-lg font-medium ml-8">{profile.location}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Heart className="w-5 h-5 mr-3 text-gray-600" />
                      <span className="text-gray-600 text-sm">Member Since</span>
                    </div>
                    <p className="text-lg font-medium ml-8">{profile.joinDate}</p>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-black pt-8">
                <h3 className="text-xl font-bold mb-4">Saved Vehicles</h3>
                  <p className="text-gray-600 mb-4">You have {favoritesCount} saved vehicles</p>
              </div>

              <div className="border-t-2 border-black pt-8">
                <button onClick={onLogout} className="flex items-center text-red-600 font-medium hover:text-red-700 transition">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
