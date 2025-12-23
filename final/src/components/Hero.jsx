import React from 'react';

const Hero = ({ setCurrentPage }) => (
  <section className="bg-white py-20 border-b-2 border-black">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Find Your Dream Car Today</h1>
          <p className="text-xl text-gray-600 mb-8">Premium selection of luxury vehicles with unbeatable prices and exceptional service</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => setCurrentPage('inventory')} className="bg-black text-white px-8 py-4 text-lg font-medium hover:bg-gray-800 transition">Browse Inventory</button>
            <button className="bg-white text-black border-2 border-black px-8 py-4 text-lg font-medium hover:bg-gray-50 transition">Schedule Test Drive</button>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop"
            alt="Luxury Car"
            className="w-full h-96 object-cover border-2 border-black"
          />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
