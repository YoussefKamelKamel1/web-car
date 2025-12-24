import React, { useState } from 'react';
import { ChevronLeft, Calendar, Clock, User, Mail, Phone, Car } from 'lucide-react';

const TestDriveSchedule = ({ setCurrentPage, selectedCar }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    carId: selectedCar?.id || '',
    carName: selectedCar?.name || '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:5000/api/test-drives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Test drive scheduled successfully!' });
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          carId: '',
          carName: '',
          message: ''
        });
        setTimeout(() => setCurrentPage('home'), 2000);
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Failed to schedule test drive' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <button 
          onClick={() => setCurrentPage(selectedCar ? 'product' : 'home')}
          className="flex items-center mb-8 hover:text-gray-600 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="ml-2">Back</span>
        </button>

        <div className="border-2 border-black p-8">
          <h1 className="text-4xl font-bold mb-2">Schedule Test Drive</h1>
          <p className="text-gray-600 mb-8">Experience your dream car firsthand</p>

          {selectedCar && (
            <div className="bg-gray-50 border-2 border-gray-300 p-4 mb-8 flex items-center">
              <Car className="w-6 h-6 mr-3 text-gray-600" />
              <div>
                <p className="font-bold text-lg">{selectedCar.name}</p>
                <p className="text-gray-600">{selectedCar.year} • ${selectedCar.price.toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="border-b-2 border-gray-200 pb-6">
              <h3 className="text-xl font-bold mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-black"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email *
                    </label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border-2 border-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone *
                    </label>
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 border-2 border-black"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {!selectedCar && (
              <div className="border-b-2 border-gray-200 pb-6">
                <h3 className="text-xl font-bold mb-4">Vehicle Selection</h3>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    <Car className="w-4 h-4 inline mr-2" />
                    Select Vehicle *
                  </label>
                  <select
                    name="carName"
                    value={formData.carName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-black"
                    required
                  >
                    <option value="">Choose a vehicle</option>
                    <option value="Mercedes-Benz S-Class">Mercedes-Benz S-Class</option>
                    <option value="BMW X5">BMW X5</option>
                    <option value="Audi A8">Audi A8</option>
                    <option value="Tesla Model S">Tesla Model S</option>
                    <option value="Porsche Cayenne">Porsche Cayenne</option>
                    <option value="Range Rover Sport">Range Rover Sport</option>
                  </select>
                </div>
              </div>
            )}

            <div className="border-b-2 border-gray-200 pb-6">
              <h3 className="text-xl font-bold mb-4">Select Date & Time</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Preferred Date *
                  </label>
                  <input 
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    className="w-full px-4 py-3 border-2 border-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Preferred Time *
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-black"
                    required
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm font-medium mb-2">
                Additional Notes (Optional)
              </label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any special requests or questions..."
                rows="4"
                className="w-full px-4 py-3 border-2 border-black"
              />
            </div>

            {submitStatus && (
              <div className={`p-4 border-2 ${submitStatus.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
                {submitStatus.message}
              </div>
            )}

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-black text-white py-4 text-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Test Drive'}
            </button>

            <p className="text-sm text-gray-600 text-center">
              * Required fields. We'll contact you within 24 hours to confirm your appointment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDriveSchedule;