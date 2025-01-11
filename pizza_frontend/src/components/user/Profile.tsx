import React, { useEffect, useState } from "react";
import Navbar from "../common/NavBar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { doSignOut } from "../../firebase/auth";
import { getAuth } from "firebase/auth";
import { useAuth } from "../../contexts/authContext";

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }
  };

  const handleLogout = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    });

    if (isConfirmed) {
      try {
        doSignOut();
        localStorage.clear();
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  return (
    <div className="w-[100%] h-[100vh]">
      <Navbar />
      <div className="w-[100%] flex justify-center items-center">
        <div className="mt-5 min-h-[30vh] rounded-xl px-[100px] py-[100px] shadow-xl flex flex-col gap-4 items-center">
          <FontAwesomeIcon
            icon={faUserCircle}
            size="10x"
            className="text-brown-600 mb-4"
          />
          {loading ? (
            <p className="text-blue-500">Loading profile...</p>
          ) : (
            currentUser && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{currentUser.displayName}</h2>
                <p className="text-lg mb-2">Email: {currentUser.email}</p>
                <p className="text-lg mb-2">
                  Loyalty Points: 
                  {/* {currentUser.loyaltyPoints} */}
                </p>
              </div>
            )
          )}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => navigate("/favorite")}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-700 text-white hover:bg-blue-500"
            >
              Favourites
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-700 text-white hover:bg-green-500"
            >
              My Orders
            </button>
            <button
              onClick={handleLogout}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-brown-800 text-white hover:bg-brown-400"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
