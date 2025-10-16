import { useState } from "react";
import { toast } from "react-toastify";
import { fireDB } from "../../../firebase/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import Loader from "../../../component/loader/Loader";
import logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";

function VenderLogin() {
  const navigate=useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signin = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(fireDB, "H-Vender_Account"),
        where("email", "==", email),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Invalid email or password", { theme: "colored" });
      } else {
        querySnapshot.forEach((doc) => {
          const vendorData = doc.data();
          localStorage.setItem("currentVender", JSON.stringify(vendorData));
          navigate("/vendor-dashboard",{ replace:true});
        });

        toast.success("Signin Successfully", { theme: "colored" });
   
      }
    } catch (error) {
      toast.error("Signin Failed", { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-900">
      {loading && <Loader />}
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row w-[95%] md:w-[1100px] md:h-[650px]">
        {/* LEFT SIDE */}
        <div className="md:w-1/2 bg-green-800 text-white flex flex-col justify-center items-center p-14">
          <img
            src={logo}
            alt="Vendor Logo"
            className="w-36 h-36 mb-6 rounded-full bg-white p-3 shadow-md"
          />
          <h1 className="text-4xl font-bold mb-4 text-center">
            Hala B Saudi
          </h1>
          <p className="text-lg text-center text-gray-200 leading-relaxed">
            Welcome to the Vendor Portal.  
            Manage your business effortlessly, stay updated with insights,  
            and connect directly with our team.
          </p>
          <p className="mt-10 text-sm text-gray-300 tracking-wide">
            Secure • Trusted • Smart Access
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/2 p-14 bg-white flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-green-800 text-center mb-10">
            Vendor Login
          </h2>
          <div className="space-y-6">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 px-5 py-4 w-full rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
              placeholder="Email"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 px-5 py-4 w-full rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-lg"
              placeholder="Password"
            />

            <button
              onClick={signin}
              className="bg-green-700 hover:bg-green-800 w-full text-white font-semibold py-4 rounded-lg transition duration-200 text-xl">
              Login
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-12">
            © {new Date().getFullYear()} Hala B Saudi — Vendor Portal
          </p>
        </div>
      </div>
    </div>
  );
}

export default VenderLogin;
