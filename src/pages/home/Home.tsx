
import Layout from '../../component/layout/Layout';

const data = [
  { title: "Total Services", Total: 17, bgColor: "bg-blue-700" },
  { title: "Total Users", Total: 14, bgColor: "bg-green-700" },
  { title: "Total Offers", Total: 12, bgColor: "bg-pink-500" },
  { title: "Total Cities", Total: 10, bgColor: "bg-red-600" },
  { title: "Total Countries", Total: 8, bgColor: "bg-yellow-600" },
  { title: "Total Discount", Total: 6, bgColor: "bg-purple-700" },
];





const Home = () => {
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  
  console.log(currentUser)
    return (
      <Layout>
         <div className="container mt-6   mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, index) => (
          <div
            key={index}
            className={`w-full h-48 ${item.bgColor} flex items-center justify-center rounded-2xl shadow-lg  border-opacity-50 border-black`}
          >
            <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-white mb-6">{item.title}</h1>
            <h1 className="text-3xl font-bold text-white  font-mono">{item.Total}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>

    </Layout>
    );
}

export default Home;
