import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin } from 'lucide-react';

const SignUp = ({ onSignUpSuccess, onBackToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    bio: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // POST to backend /api/users
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          location: formData.location || null,
          bio: formData.bio || null
        })
      });

      const json = await res.json();

      if (res.ok) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          onSignUpSuccess({
            name: formData.name,
            email: formData.email
          });
        }, 1500);
      } else {
        setError(json.message || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md border-2 border-black p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">LUXURY<span className="text-gray-600">CARS</span></h1>
          <p className="text-gray-600 mt-2">Create Your Account</p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3 border-2 border-black placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 border-2 border-black placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Phone Input (Optional) */}
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Phone (Optional)</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className="w-full pl-12 pr-4 py-3 border-2 border-black placeholder-gray-400"
              />
            </div>
          </div>

          {/* Location Input (Optional) */}
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Location (Optional)</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Los Angeles, CA"
                className="w-full pl-12 pr-4 py-3 border-2 border-black placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 border-2 border-black placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-600 hover:text-black transition"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 border-2 border-black placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5 text-gray-600 hover:text-black transition"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Bio Input (Optional) */}
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">About You (Optional)</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a bit about yourself..."
              rows="2"
              className="w-full px-4 py-3 border-2 border-black placeholder-gray-400"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-500 text-red-800 p-3">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border-2 border-green-500 text-green-800 p-3">
              {success}
            </div>
          )}

          {/* Sign Up Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t-2 border-black"></div>
          <span className="px-4 text-gray-600 text-sm">or</span>
          <div className="flex-1 border-t-2 border-black"></div>
        </div>

        {/* Back to Login Button */}
        <button 
          onClick={onBackToLogin}
          className="w-full border-2 border-black text-black py-3 font-medium hover:bg-gray-50 transition"
        >
          Back to Sign In
        </button>

        {/* Sign In Link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account? <span onClick={onBackToLogin} className="text-black font-medium cursor-pointer hover:underline">Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
