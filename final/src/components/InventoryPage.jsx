import React from 'react';
import CarCard from './CarCard';

const InventoryPage = ({ cars, onSelect }) => (
  <div className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Our Inventory</h1>
      <div className="mb-8 flex flex-wrap gap-4">
        <select className="px-4 py-2 border-2 border-black">
          <option>All Makes</option>
          <option>Mercedes-Benz</option>
          <option>BMW</option>
          <option>Audi</option>
          <option>Tesla</option>
        </select>
        <select className="px-4 py-2 border-2 border-black">
          <option>All Years</option>
          <option>2024</option>
          <option>2023</option>
          <option>2022</option>
        </select>
        <select className="px-4 py-2 border-2 border-black">
          <option>Price Range</option>
          <option>Under $50k</option>
          <option>$50k - $75k</option>
          <option>$75k - $100k</option>
          <option>Over $100k</option>
        </select>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map(car => <CarCard key={car.id} car={car} onSelect={onSelect} />)}
      </div>
    </div>
  </div>
);

export default InventoryPage;
