import { useAuth } from '../context/AuthContext';

const UserProfilePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div>
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
      </div>
      <h2 className="text-xl font-bold mt-6 mb-4">My Reservations</h2>
      {/* TODO: Show user reservations */}
    </div>
  );
};

export default UserProfilePage; 