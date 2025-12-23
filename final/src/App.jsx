import React, { useState } from 'react';
import ChatWidget from './components/ChatWidget';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CarCard from './components/CarCard';
import InventoryPage from './components/InventoryPage';
import ProductView from './components/ProductView';
import Footer from './components/Footer';
import Profile from './components/Profile';
import Login from './components/Login';

const CarSellingWebsite = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCar, setSelectedCar] = useState(null);
  const [mainImage, setMainImage] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  const cars = [
    {
      id: 1,
      name: 'Mercedes-Benz S-Class',
      price: 89999,
      year: 2023,
      mileage: '5,000 mi',
      fuel: 'Gasoline',
      transmission: 'Automatic',
      images: [
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1617531653520-bd788419a0a2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop'
      ],
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: 'BMW X5',
      price: 67500,
      year: 2023,
      mileage: '8,200 mi',
      fuel: 'Hybrid',
      transmission: 'Automatic',
      images: [
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop'
      ],
      rating: 4.6,
      reviews: 89
    },
    {
      id: 3,
      name: 'Audi A8',
      price: 79900,
      year: 2023,
      mileage: '3,500 mi',
      fuel: 'Gasoline',
      transmission: 'Automatic',
      images: [
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?w=800&h=600&fit=crop'
      ],
      rating: 4.7,
      reviews: 156
    },
    {
      id: 4,
      name: 'Tesla Model S',
      price: 94990,
      year: 2024,
      mileage: '1,200 mi',
      fuel: 'Electric',
      transmission: 'Automatic',
      images: [
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop'
      ],
      rating: 4.9,
      reviews: 203
    },
    {
      id: 5,
      name: 'Porsche Cayenne',
      price: 82400,
      year: 2023,
      mileage: '6,800 mi',
      fuel: 'Gasoline',
      transmission: 'Automatic',
      images: [
        'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop'
      ],
      rating: 4.7,
      reviews: 178
    },
    {
      id: 6,
      name: 'Range Rover Sport',
      price: 91500,
      year: 2023,
      mileage: '4,300 mi',
      fuel: 'Hybrid',
      transmission: 'Automatic',
      images: [
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop'
      ],
      rating: 4.8,
      reviews: 145
    }
  ];

  const handleMouseMove = (e) => {
    if (!isZooming) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setCurrentPage('product');
    setMainImage(0);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleSkipLogin = () => {
    setIsLoggedIn(true);
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} onSkip={handleSkipLogin} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header setCurrentPage={setCurrentPage} />

      {currentPage === 'home' && (
        <>
          <Hero setCurrentPage={setCurrentPage} />
          <Features />

          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-4xl font-bold mb-8">Featured Vehicles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cars.slice(0, 3).map(car => <CarCard key={car.id} car={car} onSelect={handleSelectCar} />)}
              </div>
            </div>
          </div>
        </>
      )}

      {currentPage === 'inventory' && <InventoryPage cars={cars} onSelect={handleSelectCar} />}

      {currentPage === 'product' && (
        <ProductView
          selectedCar={selectedCar}
          setCurrentPage={setCurrentPage}
          mainImage={mainImage}
          setMainImage={setMainImage}
          isZooming={isZooming}
          setIsZooming={setIsZooming}
          handleMouseMove={handleMouseMove}
          zoomPosition={zoomPosition}
        />
      )}

      {currentPage === 'about' && (
        <div className="py-16 bg-white min-h-screen">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8">About Us</h1>
            <p className="text-lg text-gray-600 mb-4">LuxuryCars has been serving customers for over 20 years, providing premium vehicles and exceptional service.</p>
          </div>
        </div>
      )}

      {currentPage === 'finance' && (
        <div className="py-16 bg-white min-h-screen">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8">Financing Options</h1>
            <p className="text-lg text-gray-600 mb-4">We offer competitive financing rates and flexible payment plans to fit your budget.</p>
          </div>
        </div>
      )}

      {currentPage === 'contact' && (
        <div className="py-16 bg-white min-h-screen">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
            <div className="border-2 border-black p-8">
              <div className="space-y-4">
                <input type="text" placeholder="Name" className="w-full px-4 py-3 border-2 border-black" />
                <input type="email" placeholder="Email" className="w-full px-4 py-3 border-2 border-black" />
                <textarea placeholder="Message" rows="4" className="w-full px-4 py-3 border-2 border-black"></textarea>
                <button onClick={() => alert('Message sent!')} className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition">Send Message</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'profile' && <Profile setCurrentPage={setCurrentPage} />}

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default CarSellingWebsite;