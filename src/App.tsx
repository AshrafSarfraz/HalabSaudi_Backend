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



function App() {
  return (

     <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<ProtectedRoutes><User/></ProtectedRoutes>} />
          <Route path="/venus" element={<Venus />} />
          <Route path="/services" element={<Services />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/accounts" element={<AccountManagementScreen />} />
          <Route path="/cities" element={<CityManagementScreen />} />
          <Route path="/translation" element={<Translation />} />
          <Route path="/*" element={<NoPage />} />
        </Routes>
        <ToastContainer />
      </Router>
  );
}

export default App;

export const ProtectedRoutes = ({ children }) => {
  if (localStorage.getItem('currentUser')) {
    return children
  }
  else {
    return <Navigate to='/login' />
  }
}