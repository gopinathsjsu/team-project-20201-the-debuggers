import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../lib/api';

interface Restaurant {
  id: number;
  name: string;
  description: string;
  cuisine_type: string;
  cost_rating: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website?: string;
  opening_time: string;
  closing_time: string;
  image_url?: string;
  rating?: number;
}

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await api.get(`/restaurants/${id}`);
        setRestaurant(response.data as Restaurant);
      } catch (error) {
        console.error('Error fetching restaurant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!restaurant) {
    return <div className="container mx-auto p-4">Restaurant not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{restaurant.name}</h1>
      <p>{restaurant.description}</p>
      {/* TODO: Complete restaurant details page */}
    </div>
  );
};

export default RestaurantPage; 