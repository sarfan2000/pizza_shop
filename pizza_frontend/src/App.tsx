import React from "react";
import './App.css';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./components/common/login";
import Signup from "./components/common/Signup";
import Home from "./components/common/Home";
import Dashboard from "./components/user/Dashboard"
import { TokenProvider } from "./contexts/TokenContext";
import 'react-toastify/dist/ReactToastify.css';
import { PizzaProvider } from "./contexts/PizzaContext";
import Customize from "./components/user/Customize";
import Cart from "./components/user/Cart";
import Profile from "./components/user/Profile";
import Favorite from "./components/user/Favorite";
import Order from "./components/user/Order";


const App: React.FC = () => {
  return (
    <TokenProvider>
      <PizzaProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customize" element={<Customize />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorite" element={<Favorite />} />
              <Route path="/orders" element={<Order />} />
            </Routes>
          </Router>
      </PizzaProvider>

    </TokenProvider>
  );
};

export default App;
