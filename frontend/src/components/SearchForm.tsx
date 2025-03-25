import React, { useState } from 'react';
import { FaSearch, FaCalendarAlt, FaClock, FaUser, FaMapMarkerAlt } from 'react-icons/fa';

interface SearchFormProps {
  onSearch: (params: any) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [searchParams, setSearchParams] = useState({
    date: today,
    time: '19:00',
    people: 2,
    location: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="date"
            name="date"
            min={today}
            value={searchParams.date}
            onChange={handleChange}
            className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      
      <div className="flex-1">
        <div className="relative">
          <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <select
            name="time"
            value={searchParams.time}
            onChange={handleChange}
            className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            required
          >
            <option value="11:00">11:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="13:00">1:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="16:00">4:00 PM</option>
            <option value="17:00">5:00 PM</option>
            <option value="18:00">6:00 PM</option>
            <option value="19:00">7:00 PM</option>
            <option value="20:00">8:00 PM</option>
            <option value="21:00">9:00 PM</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <select
            name="people"
            value={searchParams.people}
            onChange={handleChange}
            className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            required
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            name="location"
            placeholder="City, state or zip code"
            value={searchParams.location}
            onChange={handleChange}
            className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md flex items-center justify-center gap-2"
      >
        <FaSearch />
        <span>Find a Table</span>
      </button>
    </form>
  );
};

export default SearchForm; 