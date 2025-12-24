import React, { useState, useEffect } from 'react';
import ChatWidget from './components/ChatWidget';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CarCard from './components/CarCard';
import InventoryPage from './components/InventoryPage';
import ProductView from './components/ProductView';
import Footer from './components/Footer';
import Profile from './components/Profile';
import TestDriveSchedule from './components/TestDriveSchedule';
import Login from './components/Login';

const CarSellingWebsite = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCar, setSelectedCar] = useState(null);
  const [mainImage, setMainImage] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [carsError, setCarsError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchCars = async () => {
      setCarsLoading(true);
      setCarsError(null);
      try {
        const res = await fetch('http://localhost:5000/api/cars');
        if (!res.ok) throw new Error(`Failed to fetch cars: ${res.status}`);
        const json = await res.json();
        if (mounted) setCars(json.data || []);
      } catch (err) {
        if (mounted) setCarsError(err.message || 'Failed to load cars');
      } finally {
        if (mounted) setCarsLoading(false);
      }
    };
    fetchCars();
    return () => { mounted = false; };
  }, []);

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

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactStatus, setContactStatus] = useState(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactStatus(null);
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMessage })
      });
      const json = await res.json();
      if (res.ok) {
        setContactStatus({ type: 'success', message: json.message || 'Message sent' });
        setContactName(''); setContactEmail(''); setContactMessage('');
      } else {
        setContactStatus({ type: 'error', message: json.message || 'Failed to send message' });
      }
    } catch (err) {
      setContactStatus({ type: 'error', message: 'Network error' });
    } finally {
      setContactLoading(false);
    }
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
                {carsLoading && <div>Loading cars…</div>}
                {carsError && <div className="text-red-600">{carsError}</div>}
                {!carsLoading && !carsError && cars.slice(0, 3).map(car => <CarCard key={car.id} car={car} onSelect={handleSelectCar} />)}
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
          user={user}
          mainImage={mainImage}
          setMainImage={setMainImage}
          isZooming={isZooming}
          setIsZooming={setIsZooming}
          handleMouseMove={handleMouseMove}
          zoomPosition={zoomPosition}
        />
      )}

      {currentPage === 'testdrive' && (
        <TestDriveSchedule setCurrentPage={setCurrentPage} selectedCar={selectedCar} />
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
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input value={contactName} onChange={e => setContactName(e.target.value)} type="text" placeholder="Name" className="w-full px-4 py-3 border-2 border-black" required />
                <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} type="email" placeholder="Email" className="w-full px-4 py-3 border-2 border-black" required />
                <textarea value={contactMessage} onChange={e => setContactMessage(e.target.value)} placeholder="Message" rows={4} className="w-full px-4 py-3 border-2 border-black" required />
                {contactStatus && (
                  <div className={`p-3 ${contactStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-500' : 'bg-red-50 text-red-800 border border-red-500'}`}>{contactStatus.message}</div>
                )}
                <button type="submit" disabled={contactLoading} className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition disabled:bg-gray-400">{contactLoading ? 'Sending…' : 'Send Message'}</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'profile' && <Profile setCurrentPage={setCurrentPage} user={user} setUser={setUser} />}

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default CarSellingWebsite;