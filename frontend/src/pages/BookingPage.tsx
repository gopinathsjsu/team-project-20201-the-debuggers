import { useParams } from 'react-router-dom';

const BookingPage = () => {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book a Table</h1>
      <p>Restaurant ID: {id}</p>
      {/* TODO: Complete booking form implementation */}
    </div>
  );
};

export default BookingPage; 