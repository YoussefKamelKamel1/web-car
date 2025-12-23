import React from 'react';
import { Star } from 'lucide-react';

const CarCard = ({ car, onSelect }) => (
  <div className="bg-white border-2 border-black overflow-hidden hover:shadow-xl transition cursor-pointer" onClick={() => onSelect(car)}>
    <img src={car.images[0]} alt={car.name} className="w-full h-64 object-cover" />
    <div className="p-6">
      <div className="flex items-center mb-2">
        <Star className="w-4 h-4 fill-black" />
        <span className="ml-1 text-sm font-medium">{car.rating}</span>
        <span className="ml-1 text-sm text-gray-600">({car.reviews})</span>
      </div>
      <h3 className="text-xl font-bold mb-2">{car.name}</h3>
      <p className="text-3xl font-bold mb-4">${car.price.toLocaleString()}</p>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
        <div>Year: {car.year}</div>
        <div>Mileage: {car.mileage}</div>
        <div>Fuel: {car.fuel}</div>
        <div>{car.transmission}</div>
      </div>
      <button className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition">View Details</button>
    </div>
  </div>
);

export default CarCard;
