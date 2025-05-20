import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Layout from '../../component/layout/Layout';

const Home = () => {
  const [restaurantsByCountry, setRestaurantsByCountry] = useState<any>({});
  const [loading, setLoading] = useState(true); // <-- New loading state

  useEffect(() => {
    const fetchRestaurants = async () => {
      const db = getFirestore();
      try {
        const restaurantsSnap = await getDocs(collection(db, 'Brands'));
        const restaurantsList = restaurantsSnap.docs.map(doc => doc.data());

        // Group restaurants by selectedCountry
        const groupedByCountry = restaurantsList.reduce((acc: any, restaurant: any) => {
          const country = restaurant.selectedCountry;
          if (!acc[country]) {
            acc[country] = [];
          }
          acc[country].push(restaurant);
          return acc;
        }, {});

        setRestaurantsByCountry(groupedByCountry);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false); // <-- Stop loader after fetching
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <Layout>
      <div className="container mt-6 mx-auto p-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">All Brands</h1>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></span>
          </div>
        ) : (
          // When loading is false, show restaurants
          <>
            {Object.keys(restaurantsByCountry).map((country, index) => (
              <div key={index} className="mt-6">
                <h2 className="text-2xl font-bold">{country}</h2>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-6 mt-4">
                  {restaurantsByCountry[country].map((restaurant: any, index: number) => (
                    <div
                      key={index}
                      className="w-full bg-white rounded-2xl shadow-lg border-opacity-50 border-black p-4"
                    >
                      <img
                        src={restaurant.img}
                        alt={restaurant.nameEng}
                        className="w-full h-40 object-cover rounded-2xl mb-4"
                      />
                      <h3 className="text-xl font-bold text-gray-800">{restaurant.nameEng}</h3>
                      <p className="text-gray-600">{restaurant.selectedVenue}, {restaurant.selectedCountry}</p>
                    </div>
                  ))}
                </div>

                {/* Show message if no restaurants are available */}
                {restaurantsByCountry[country].length === 0 && (
                  <p className="text-gray-500 mt-4">No restaurants available for {country}.</p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;
