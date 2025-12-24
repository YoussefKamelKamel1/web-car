import React, { useState } from 'react';
import { ChevronLeft, Star, Heart } from 'lucide-react';

const ProductView = ({ selectedCar, setCurrentPage, user, mainImage, setMainImage, isZooming, setIsZooming, handleMouseMove, zoomPosition }) => {
  if (!selectedCar) return null;

  const [favLoading, setFavLoading] = useState(false);
  const [favStatus, setFavStatus] = useState(null);

  const handleAddFavorite = async () => {
    setFavLoading(true);
    setFavStatus(null);
    try {
      const res = await fetch('http://localhost:5000/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user?.email || 'guest@example.com', carId: selectedCar.id })
      });
      const json = await res.json();
      if (res.ok) setFavStatus({ type: 'success', message: json.message || 'Added to favorites' });
      else setFavStatus({ type: 'error', message: json.message || 'Failed to add favorite' });
    } catch (err) {
      setFavStatus({ type: 'error', message: 'Network error' });
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <button onClick={() => setCurrentPage('inventory')} className="flex items-center mb-8 hover:text-gray-600 transition">
          <ChevronLeft className="w-5 h-5" />
          <span className="ml-2">Back to Inventory</span>
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="relative border-2 border-black mb-4 overflow-hidden cursor-crosshair"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <img src={selectedCar.images[mainImage]} alt={selectedCar.name} className="w-full h-96 object-cover" style={{ transform: isZooming ? 'scale(2)' : 'scale(1)', transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`, transition: isZooming ? 'none' : 'transform 0.3s' }} />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {selectedCar.images.map((img, idx) => (
                <img key={idx} src={img} alt={`${selectedCar.name} ${idx + 1}`} className={`w-full h-20 object-cover border-2 cursor-pointer ${mainImage === idx ? 'border-black' : 'border-gray-300'}`} onClick={() => setMainImage(idx)} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 fill-black" />
              <span className="ml-2 text-lg font-medium">{selectedCar.rating}</span>
              <span className="ml-2 text-gray-600">({selectedCar.reviews} reviews)</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{selectedCar.name}</h1>
            <p className="text-4xl font-bold mb-8">${selectedCar.price.toLocaleString()}</p>

            <div className="border-2 border-black p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Year</p>
                  <p className="font-medium">{selectedCar.year}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Mileage</p>
                  <p className="font-medium">{selectedCar.mileage}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Fuel Type</p>
                  <p className="font-medium">{selectedCar.fuel}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Transmission</p>
                  <p className="font-medium">{selectedCar.transmission}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button onClick={() => setCurrentPage('testdrive')} className="w-full bg-black text-white py-4 text-lg font-medium hover:bg-gray-800 transition">Schedule Test Drive</button>
              <button className="w-full bg-gray-100 border-2 border-black py-4 text-lg font-medium hover:bg-gray-200 transition">Contact Dealer</button>
              <button onClick={handleAddFavorite} disabled={favLoading} className="w-full bg-gray-100 border-2 border-black py-4 text-lg font-medium hover:bg-gray-200 transition flex items-center justify-center">
                <Heart className="w-5 h-5 mr-2" />{favLoading ? 'Adding…' : 'Add to Favorites'}
              </button>
              {favStatus && (
                <div className={`mt-3 p-3 ${favStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-500' : 'bg-red-50 text-red-800 border border-red-500'}`}>{favStatus.message}</div>
              )}
            </div>

            <div className="mt-8 border-t-2 border-black pt-8">
              <h3 className="font-bold text-lg mb-4">Features</h3>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li>• Navigation System</li>
                <li>• Leather Seats</li>
                <li>• Backup Camera</li>
                <li>• Bluetooth</li>
                <li>• Heated Seats</li>
                <li>• Sunroof</li>
                <li>• Parking Sensors</li>
                <li>• Premium Audio</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
