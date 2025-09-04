import React, { ReactNode } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/ReactToastify.css'
import Home from "./pages/home/Home";
import Services from "./pages/services/Services";
import Translation from "./pages/translation/Translation";
import Offers from "./pages/offers/Offer";
import { User } from "./pages/user/User";
import Venus from "./pages/venus/venus";
import CityManagementScreen from "./pages/cities/Cities";
import AccountManagementScreen from "./pages/accounts/Account";
import Login from "./pages/Authentication/login/Login";
import NoPage from "./pages/NoPage";
import AddBrandScreen from "./pages/Mobile_Screen/AddBrandsData";
import Group_Account from "./pages/Group Account/GroupAccount";
import BrandList from "./pages/Group Account/BrandList";

interface ProtectedRoutesProps {
  children: ReactNode;
}

function App() {
  return (

     <Router> 
        <Routes>
          <Route path="/" element={<ProtectedRoutes><Home/></ProtectedRoutes>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<ProtectedRoutes><User/></ProtectedRoutes>} />
          <Route path="/venues" element={<ProtectedRoutes><Venus/></ProtectedRoutes>} />
          <Route path="/services" element={<ProtectedRoutes><Services/></ProtectedRoutes>} />
          <Route path="/offers" element={<ProtectedRoutes><Offers/></ProtectedRoutes>} />
          <Route path="/accounts" element={<ProtectedRoutes><AccountManagementScreen/></ProtectedRoutes>} />
          <Route path="/cities" element={<ProtectedRoutes><CityManagementScreen/></ProtectedRoutes>} />
          {/* <Route path="/translation" element={<ProtectedRoutes><Translation/></ProtectedRoutes>} /> */}
          <Route path="/group_account" element={<ProtectedRoutes><Group_Account/></ProtectedRoutes>} />
          <Route path="/brands/:id" element={<ProtectedRoutes><BrandList/></ProtectedRoutes>} />
          <Route path="/AddBrand/12652154214641264521465124xxp1" element={<AddBrandScreen/>} />
          <Route path="/*" element={<NoPage />} />
        </Routes>
        <ToastContainer />
      </Router>
  );
}

export default App;

export const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  if (localStorage.getItem("currentUser")) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }
};