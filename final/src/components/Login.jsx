import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLoginSuccess, onSkip }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      onLoginSuccess({
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md border-2 border-black p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">LUXURY<span className="text-gray-600">CARS</span></h1>
          <p className="text-gray-600 mt-2">Your Premium Car Dealership</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 border-2 border-black placeholder-gray-400"
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Remember Me */}
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="remember"
              className="w-4 h-4 border-2 border-black"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {isLoading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t-2 border-black"></div>
          <span className="px-4 text-gray-600 text-sm">or</span>
          <div className="flex-1 border-t-2 border-black"></div>
        </div>

        {/* Skip Button */}
        <button 
          onClick={onSkip}
          className="w-full border-2 border-black text-black py-3 font-medium hover:bg-gray-50 transition"
        >
          Skip for Now
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account? <span className="text-black font-medium cursor-pointer hover:underline">Sign up</span>
        </p>

        {/* Demo Credentials Hint */}
        <div className="mt-8 bg-gray-50 border-2 border-gray-300 p-4">
          <p className="text-xs font-medium text-gray-600 mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-600">Email: <span className="font-mono">demo@example.com</span></p>
          <p className="text-xs text-gray-600">Password: <span className="font-mono">demo123</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
