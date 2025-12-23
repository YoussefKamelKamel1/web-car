import React from 'react';

const Features = () => (
  <section className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 border-2 border-black">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center text-2xl font-bold mb-4">1</div>
          <h3 className="text-xl font-bold mb-3">Premium Selection</h3>
          <p className="text-gray-600">Curated collection of the finest luxury vehicles from top manufacturers</p>
        </div>
        <div className="bg-white p-8 border-2 border-black">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center text-2xl font-bold mb-4">2</div>
          <h3 className="text-xl font-bold mb-3">Best Prices</h3>
          <p className="text-gray-600">Competitive pricing with flexible financing options available</p>
        </div>
        <div className="bg-white p-8 border-2 border-black">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center text-2xl font-bold mb-4">3</div>
          <h3 className="text-xl font-bold mb-3">Expert Service</h3>
          <p className="text-gray-600">Professional team dedicated to helping you find the perfect vehicle</p>
        </div>
      </div>
    </div>
  </section>
);

export default Features;
