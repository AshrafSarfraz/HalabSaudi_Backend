import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";

function VendorDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex justify-between items-center bg-green-800 text-white py-5 px-10 shadow-md">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full bg-white p-1" />
          <h1 className="text-2xl font-bold">HBS Vendor Portal</h1>
        </div>
        <div className="text-lg font-medium">
          Welcome, <span className="font-semibold">{name || "Vendor"}</span>
          <button onClick={()=>{}}
        className="bg-yellow-600 py-2 px-6 rounded ml-5">
            Log out
            </button>
        </div>
     
      </header>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-center items-center flex-1 gap-10 p-10">
        {/* Redeem History Button */}
        <button
          onClick={() => navigate("/Vender-RedeemHistory")}
          className="h-52 w-72 bg-green-600 hover:bg-green-700 text-white font-bold text-2xl rounded-3xl border-4 border-green-800 shadow-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105"
        >
          Redeem History
          <span className="text-base font-normal mt-2 text-green-200 text-center">
            View all redeemed vouchers
          </span>
        </button>

        {/* Brands Button */}
        <button
          onClick={() => navigate("/Vender-Brands")}
          className="h-52 w-72 bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-2xl rounded-3xl border-4 border-yellow-800 shadow-lg flex flex-col items-center justify-center transition-transform transform hover:scale-105"
        >
          Brands
          <span className="text-base font-normal mt-2 text-yellow-100 text-center">
            Explore available brands
          </span>
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm py-5">
        © {new Date().getFullYear()} Hala B Saudi — Vendor Portal
      </footer>
    </div>
  );
}

export default VendorDashboard;
