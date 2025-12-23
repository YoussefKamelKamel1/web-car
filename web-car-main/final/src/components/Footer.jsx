import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => (
  <footer className="bg-black text-white py-12 border-t-2 border-black">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-bold mb-4">LUXURYCARS</h3>
          <p className="text-gray-400">Your trusted partner in finding the perfect luxury vehicle</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li className="cursor-pointer hover:text-white">About Us</li>
            <li className="cursor-pointer hover:text-white">Inventory</li>
            <li className="cursor-pointer hover:text-white">Finance</li>
            <li className="cursor-pointer hover:text-white">Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <div className="space-y-2 text-gray-400">
            <div className="flex items-center"><Phone className="w-4 h-4 mr-2" /> (555) 123-4567</div>
            <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /> info@luxurycars.com</div>
            <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> 123 Auto Plaza, CA</div>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <Facebook className="w-6 h-6 cursor-pointer hover:text-gray-400" />
            <Instagram className="w-6 h-6 cursor-pointer hover:text-gray-400" />
            <Twitter className="w-6 h-6 cursor-pointer hover:text-gray-400" />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
        <p>&copy; 2024 LuxuryCars. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
