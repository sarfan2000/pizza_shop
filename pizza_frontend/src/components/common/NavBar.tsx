import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHome, faPizzaSlice, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="flex w-[100%] px-4 items-center justify-between h-[60px] bg-brown-600">
      <div className="text-2xl text-brown-100 font-bold">Pizza Palette</div>
      <div className="flex justify-between gap-2">
        {location.pathname === '/' ? (
          <>
            <Link
              to="/login"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-800 text-white hover:bg-brown-400"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-800 text-white hover:bg-brown-400"
            >
              Signup
            </Link>
          </>
        ) : location.pathname === '/login' ? (
          <>
            <Link
              to="/"
              className="py-2 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-800 text-white hover:bg-brown-400"
            >
              Home
            </Link>
            <Link
              to="/signup"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-800 text-white hover:bg-brown-400"
            >
              Signup
            </Link>
          </>
        ) : location.pathname === '/signup' ? (
          <>
            <Link
              to="/"
              className="py-2 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-800 text-white hover:bg-brown-400"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-800 text-white hover:bg-brown-400"
            >
              Login
            </Link>
          </>
        ) : (location.pathname === '/dashboard' || location.pathname === '/customize' || location.pathname === '/cart' || location.pathname === '/favorite' || location.pathname === '/profile' || location.pathname === '/orders') ? (
          <>
            <Link
              to="/dashboard"
              className="py-2 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-800 text-white hover:bg-brown-400"
            >
              <FontAwesomeIcon icon={faHome} />
              Dashboard
            </Link>
            <Link
              to="/customize"
              className="py-2 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-800 text-white hover:bg-brown-400"
            >
              <FontAwesomeIcon icon={faPizzaSlice} />
              Customize
            </Link>
            <Link
              to="/favorite"
              className="py-2 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-800 text-white hover:bg-brown-400"
            >
              <FontAwesomeIcon icon={faHeart} />
              Favorite
            </Link>
            <Link
              to="/cart"
              className="py-2 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-800 text-white hover:bg-brown-400"
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              Cart
            </Link>
            <Link
              to="/profile"
              className="py-2 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-800 text-white hover:bg-brown-400"
            >
              <FontAwesomeIcon icon={faUser} />
              Profile
            </Link>
          </>
        ) : null}

      </div>
    </div>
  );
};

export default Navbar;