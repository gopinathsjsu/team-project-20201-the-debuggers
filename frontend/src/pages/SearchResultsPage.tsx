import { useSearchParams } from 'react-router-dom';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      <div>
        <p>Date: {searchParams.get('date')}</p>
        <p>Time: {searchParams.get('time')}</p>
        <p>People: {searchParams.get('people')}</p>
        <p>Location: {searchParams.get('location')}</p>
      </div>
      {/* TODO: Complete search results implementation */}
    </div>
  );
};

export default SearchResultsPage; 