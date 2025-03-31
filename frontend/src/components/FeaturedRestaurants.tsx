import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { FaStar, FaUtensils } from 'react-icons/fa';

interface Restaurant {
  id: number;
  name: string;
  cuisine_type: string;
  cost_rating: string;
  address: string;
  city: string;
  state: string;
  rating?: number;
  image_url?: string;
  bookings_today?: number;
}

const FeaturedRestaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      try {
        // In a real app, you'd have a proper API endpoint for featured restaurants
        // For now, we'll use a search with default parameters to get some restaurants
        const today = new Date().toISOString().split('T')[0];
        const response = await api.get('/restaurants/search', {
          params: {
            date: today,
            time: '19:00',
            people: 2
          }
        });
        // Add type assertion to handle the unknown type
        const data = response.data as Restaurant[];
        setRestaurants(data.slice(0, 6)); // Just take the first 6
      } catch (error) {
        console.error('Error fetching featured restaurants:', error);
        // For development, let's add some mock data
        setRestaurants(mockRestaurants);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {restaurants.map(restaurant => (
        <Link to={`/restaurant/${restaurant.id}`} key={restaurant.id} className="block">
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-cover bg-center" style={{ 
              backgroundImage: `url(${restaurant.image_url || getRandomRestaurantImage()})` 
            }}></div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-1">{restaurant.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <FaUtensils className="mr-1" />
                <span>{restaurant.cuisine_type}</span>
                <span className="mx-2">•</span>
                <span>{restaurant.cost_rating}</span>
              </div>
              <div className="flex items-center text-sm">
                <div className="flex text-yellow-400 mr-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < (restaurant.rating || 4) ? "text-yellow-400" : "text-gray-300"} />
                  ))}
                </div>
                <span className="text-gray-600">
                  {restaurant.bookings_today 
                    ? `Booked ${restaurant.bookings_today} ${restaurant.bookings_today === 1 ? 'time' : 'times'} today`
                    : 'New on BookTable'}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

// Helper function for mock data
const getRandomRestaurantImage = () => {
  const images = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    'https://images.unsplash.com/photo-1515669097368-22e68427d265',
    'https://images.unsplash.com/photo-1559304822-9eb2813c9844',
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17',
    'https://images.unsplash.com/photo-1544148103-0773bf10d330'
  ];
  return images[Math.floor(Math.random() * images.length)];
};

// Mock data for development
const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    name: 'Trattoria Milano',
    cuisine_type: 'Italian',
    cost_rating: '$$$',
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    bookings_today: 24
  },
  {
    id: 2,
    name: 'Sakura Sushi',
    cuisine_type: 'Japanese',
    cost_rating: '$$',
    address: '456 Market St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.5,
    image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754',
    bookings_today: 18
  },
  {
    id: 3,
    name: 'Spice of India',
    cuisine_type: 'Indian',
    cost_rating: '$$',
    address: '789 Mission St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.2,
    image_url: 'https://images.unsplash.com/photo-1517244683847-7456b63c5969',
    bookings_today: 12
  },
  {
    id: 4,
    name: 'Le Bistro Parisien',
    cuisine_type: 'French',
    cost_rating: '$$$$',
    address: '321 Geary St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1559304822-9eb2813c9844',
    bookings_today: 15
  },
  {
    id: 5,
    name: 'Taqueria El Sol',
    cuisine_type: 'Mexican',
    cost_rating: '$',
    address: '654 Valencia St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.3,
    image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    bookings_today: 30
  },
  {
    id: 6,
    name: 'Golden Dragon',
    cuisine_type: 'Chinese',
    cost_rating: '$$',
    address: '987 Kearny St',
    city: 'San Francisco',
    state: 'CA',
    rating: 4.4,
    image_url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa',
    bookings_today: 22
  }
];

export default FeaturedRestaurants; 