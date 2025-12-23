import React from 'react';
import { Search, Heart, User } from 'lucide-react';

const Header = ({ setCurrentPage }) => (
  <header className="bg-white border-b-2 border-black sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold cursor-pointer" onClick={() => setCurrentPage('home')}>
          LUXURY<span className="text-gray-600">CARS</span>
        </div>

        <nav className="hidden md:flex space-x-8">
          <button onClick={() => setCurrentPage('home')} className="font-medium hover:text-gray-600 transition">Home</button>
          <button onClick={() => setCurrentPage('inventory')} className="font-medium hover:text-gray-600 transition">Inventory</button>
          <button onClick={() => setCurrentPage('about')} className="font-medium hover:text-gray-600 transition">About</button>
          <button onClick={() => setCurrentPage('finance')} className="font-medium hover:text-gray-600 transition">Finance</button>
          <button onClick={() => setCurrentPage('contact')} className="font-medium hover:text-gray-600 transition">Contact</button>
        </nav>

        <div className="flex items-center space-x-4">
          <Search className="w-5 h-5 cursor-pointer hover:text-gray-600" />
          <Heart className="w-5 h-5 cursor-pointer hover:text-gray-600" />
          <User className="w-5 h-5 cursor-pointer hover:text-gray-600 transition" onClick={() => setCurrentPage('profile')} />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
