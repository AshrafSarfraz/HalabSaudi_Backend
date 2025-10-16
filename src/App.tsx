import React, { ReactNode } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/home/Home";
import Services from "./pages/services/Services";
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
import VenderAccounts from "./pages/Venders/addVenders";
import VenderLogin from "./pages/Venders/login/Login";
import VendorDashboard from "./pages/Venders/venderDashboard";
import { Vender_Redeemed_Histroy } from "./pages/Venders/redeemedHistory";
import VenderBrands from "./pages/Venders/Brands";

// ✅ Common interface for protected routes
interface ProtectedRoutesProps {
  children: ReactNode;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin side routes */}
        <Route path="/" element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<ProtectedRoutes><User /></ProtectedRoutes>} />
        <Route path="/venues" element={<ProtectedRoutes><Venus /></ProtectedRoutes>} />
        <Route path="/services" element={<ProtectedRoutes><Services /></ProtectedRoutes>} />
        <Route path="/offers" element={<ProtectedRoutes><Offers /></ProtectedRoutes>} />
        <Route path="/accounts" element={<ProtectedRoutes><AccountManagementScreen /></ProtectedRoutes>} />
        <Route path="/cities" element={<ProtectedRoutes><CityManagementScreen /></ProtectedRoutes>} />
        <Route path="/group_account" element={<ProtectedRoutes><Group_Account /></ProtectedRoutes>} />
        <Route path="/brands/:id" element={<ProtectedRoutes><BrandList /></ProtectedRoutes>} />
        <Route path="/AddBrand/12652154214641264521465124xxp1" element={<AddBrandScreen />} />
        <Route path="/*" element={<NoPage />} />

        {/* Vendor side routes */}
        <Route path="/vender-acc" element={<ProtectedRoutes><VenderAccounts /></ProtectedRoutes>} />
        <Route path="/vender-login" element={<VenderLogin />} />
        <Route path="/vendor-dashboard" element={<ProtectedRoutes2><VendorDashboard /></ProtectedRoutes2>} />
        <Route path="/Vender-RedeemHistory" element={<ProtectedRoutes2><Vender_Redeemed_Histroy /></ProtectedRoutes2>} />
        <Route path="/Vender-Brands" element={<ProtectedRoutes2><VenderBrands /></ProtectedRoutes2>} />
      </Routes>

      <ToastContainer />
    </Router>
  );
}

export default App;

// ✅ Admin Protected Route
export const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  return localStorage.getItem("currentUser") ? <>{children}</> : <Navigate to="/login" />;
};

// ✅ Vendor Protected Route
export const ProtectedRoutes2: React.FC<ProtectedRoutesProps> = ({ children }) => {
  return localStorage.getItem("currentVender") ? <>{children}</> : <Navigate to="/vender-login" />;
};
