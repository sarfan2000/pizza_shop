import React, { useEffect, useState } from "react";
import Navbar from "../common/NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faShoppingCart,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { getAuth } from "firebase/auth";
import { FavoriteItem } from "../../models/favorite";



const Favorite: React.FC = () => {
  const navigate = useNavigate();
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchFavoriteItems();
  }, []);

  const fetchFavoriteItems = async () => {
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const token = await user.getIdToken();

      const response = await axios.get(
        "http://localhost:3020/api/auth/get-favorites",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFavoriteItems(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (producId: string) => {
    try {
      const token = await user?.getIdToken();

      const response = await axios.delete(
        `http://localhost:3020/api/auth/remove-favorite/${producId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        Swal.fire("Success", "Pizza removed from favorites!", "success");
        fetchFavoriteItems(); // Refresh the favorite items
      } else {
        Swal.fire("Error", "Failed to remove pizza from favorites.", "error");
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      Swal.fire("Error", "Failed to remove pizza from favorites.", "error");
    }
  };

  const addToCart = async (producId: string) => {
    try {
      const token = await user?.getIdToken();

      const response = await axios.post(
        `http://localhost:3020/api/auth/add-cart/${producId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        Swal.fire("Success", "Pizza added to cart!", "success");
      } else {
        Swal.fire("Error", "Failed to add pizza from cart.", "error");
      }
    } catch (error) {
      console.error("Error adding from cart:", error);
      Swal.fire("Error", "Failed to add pizza from cart.", "error");
    }
  };

  return (
    <div className="w-[100%] h-[100vh]">
      <Navbar />

      <h3 className="flex justify-center px-4 pt-4 text-2xl font-bold text-gray-800">
        Favorites
      </h3>
      <div className="w-[100%] flex justify-center items-center">
        <div className="mt-5 w-[60vw] min-h-[30vh] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4">
          {loading && (
            <p className="text-blue-500">Loading favorite items...</p>
          )}
          {favoriteItems?.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center mt-16 text-center text-gray-500">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                size="4x"
                className="mb-4"
              />
              <p className="text-lg">Your favorites list is empty.</p>
            </div>
          )}
          <div className="grid w-full grid-cols-2 gap-4 p-5">
            {Array.isArray(favoriteItems) &&
              favoriteItems?.map((item: FavoriteItem, index) => (
                <div
                  key={index}
                  className="p-5 border rounded-lg shadow-lg border-brown-800"
                >
                  <h2 className="text-lg font-bold">{item.product.name}</h2>
                  <p>Crust: {item.product.crust}</p>
                  <p>Sauce: {item.product.sauce}</p>
                  <p>Cheese: {item.product.cheese}</p>
                  <p>Toppings: {item.product.toppings}</p>
                  <p className="font-bold text-green-600">
                    Price: $ {item.product.price}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(item.product._id ?? "")}
                      className="flex items-center gap-2 p-3 mt-4 text-white bg-blue-700 rounded hover:bg-blue-500"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </button>
                    <button
                      onClick={() =>
                        handleRemoveFavorite(item.product._id ?? "")
                      }
                      className="flex items-center gap-2 p-3 mt-4 text-white bg-red-700 rounded hover:bg-red-500"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorite;
