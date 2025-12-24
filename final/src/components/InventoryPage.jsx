import React, { useState, useEffect } from 'react';
import CarCard from './CarCard';

const InventoryPage = ({ cars = [], onSelect }) => {
  const [displayCars, setDisplayCars] = useState(cars);
  const [make, setMake] = useState('');
  const [year, setYear] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => setDisplayCars(cars), [cars]);

  const fetchFiltered = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (make) params.append('make', make);
      if (year) params.append('year', year);
      // translate priceRange to min/max
      if (priceRange === 'under50') { params.append('maxPrice', '50000'); }
      if (priceRange === '50-75') { params.append('minPrice', '50000'); params.append('maxPrice', '75000'); }
      if (priceRange === '75-100') { params.append('minPrice', '75000'); params.append('maxPrice', '100000'); }
      if (priceRange === 'over100') { params.append('minPrice', '100000'); }

      const res = await fetch(`http://localhost:5000/api/cars?${params.toString()}`);
      const json = await res.json();
      if (res.ok && json.data) setDisplayCars(json.data);
    } catch (err) {
      // ignore
    } finally { setLoading(false); }
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Our Inventory</h1>
        <div className="mb-8 flex flex-wrap gap-4">
          <select value={make} onChange={e => setMake(e.target.value)} className="px-4 py-2 border-2 border-black">
            <option value="">All Makes</option>
            <option value="Mercedes">Mercedes-Benz</option>
            <option value="BMW">BMW</option>
            <option value="Audi">Audi</option>
            <option value="Tesla">Tesla</option>
          </select>
          <select value={year} onChange={e => setYear(e.target.value)} className="px-4 py-2 border-2 border-black">
            <option value="">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <select value={priceRange} onChange={e => setPriceRange(e.target.value)} className="px-4 py-2 border-2 border-black">
            <option value="">Price Range</option>
            <option value="under50">Under $50k</option>
            <option value="50-75">$50k - $75k</option>
            <option value="75-100">$75k - $100k</option>
            <option value="over100">Over $100k</option>
          </select>
          <button onClick={fetchFiltered} className="px-4 py-2 bg-black text-white">Filter</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && <div>Loading…</div>}
          {!loading && displayCars.map(car => <CarCard key={car.id} car={car} onSelect={onSelect} />)}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
