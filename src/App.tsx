import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Account from "./pages/accounts/Account";
import Countries from "./pages/country/Countries";
import Services from "./pages/services/Services";
import Translation from "./pages/translation/Translation";
import Offers from "./pages/offers/Offer";
import { User } from "./pages/user/User";
import Venus from "./pages/venus/venus";
import CityManagementScreen from "./pages/cities/Cities";
import AccountManagementScreen from "./pages/accounts/Account";



function App() {
  return (

     <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<User/>} />
          <Route path="/venus" element={<Venus />} />
          <Route path="/services" element={<Services />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/accounts" element={<AccountManagementScreen />} />
          <Route path="/cities" element={<CityManagementScreen />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/translation" element={<Translation />} />
        </Routes>
      </Router>
  );
}

export default App;
