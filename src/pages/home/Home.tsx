import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Layout from '../../component/layout/Layout';

const Home = () => {
  const [restaurantsByCountry, setRestaurantsByCountry] = useState<any>({});

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
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <Layout>
      <div className="container mt-6 mx-auto p-4">
      <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">All Restaurants</h1>
        </div>
        {/* Loop through each country section */}
        {Object.keys(restaurantsByCountry).map((country, index) => (
          <div key={index} className="mt-6">
            <h2 className="text-2xl font-bold">{country}</h2>
            
            {/* Show restaurants for each country */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5  gap-6 mt-4">
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
                  <p className="text-gray-600">{restaurant.selectedCity}, {restaurant.selectedCountry}</p>
                </div>
              ))}
            </div>

            {/* Show message if no restaurants are available for the country */}
            {restaurantsByCountry[country].length === 0 && (
              <p className="text-gray-500 mt-4">No restaurants available for {country}.</p>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
