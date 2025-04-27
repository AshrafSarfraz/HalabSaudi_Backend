import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import Layout from '../../component/layout/Layout';

const Home = () => {
  const [counts, setCounts] = useState({
    services: 0,
    users: 0,
    offers: 0,
    cities: 0,
    countries: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      try {
        const [
          servicesSnap,
          usersSnap,
          offersSnap,
          citiesSnap,
          countriesSnap,
        ] = await Promise.all([
          getDocs(collection(db, 'Brands')),
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'FlatOffers')),
          getDocs(collection(db, 'Venues')),
          getDocs(collection(db, 'Cities')),
        ]);

        setCounts({
          services: servicesSnap.size,
          users: usersSnap.size,
          offers: offersSnap.size,
          cities: citiesSnap.size,
          countries: countriesSnap.size,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const data = [
    { title: 'Total Users', total: counts.users, bgColor: 'bg-green-700' },
    { title: 'Total Services', total: counts.services, bgColor: 'bg-blue-700' },
    { title: 'Total Flat Offer', total: counts.offers, bgColor: 'bg-pink-500' },
    { title: 'Total Venues', total: counts.cities, bgColor: 'bg-red-600' },
    { title: 'Total Cities', total: counts.countries, bgColor: 'bg-yellow-600' },
  ];

  return (
    <Layout>
      <div className="container mt-6 mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <div
              key={index}
              className={`w-full h-48 ${item.bgColor} flex items-center justify-center rounded-2xl shadow-lg border-opacity-50 border-black`}
            >
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-white mb-6">{item.title}</h1>
                <h1 className="text-3xl font-bold text-white font-mono">{item.total}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
