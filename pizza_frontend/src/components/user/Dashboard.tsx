import React, { useEffect, useState } from "react";
import Navbar from "../common/NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pizza } from "../../models/pizza";
import pizza2 from "../../assets/pizza2.png";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { getAuth } from "firebase/auth";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [pizzas, setPizzas] = useState<Pizza[]>([]);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchAllProductData();
  }, []);

  const fetchAllProductData = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const token = await user.getIdToken();

      const response = await axios.get(
        "http://localhost:3020/api/auth/get-all-products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPizzas(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
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

  const addToFavorites = async (producId: string) => {
    try {
      const token = await user?.getIdToken();

      const response = await axios.post(
        `http://localhost:3020/api/auth/add-favorite/${producId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        Swal.fire("Success", "Pizza added to favorites!", "success");
      } else {
        Swal.fire("Error", "Failed to add pizza from favorites.", "error");
      }
    } catch (error) {
      console.error("Error adding from favorites:", error);
      Swal.fire("Error", "Failed to add pizza from favorites.", "error");
    }
  };

  return (
    <div className="w-[100%] h-[100vh]">
      <Navbar />

      <h3 className="flex justify-center px-4 pt-4 text-2xl font-bold text-gray-800">
        Featured
      </h3>

      <div className="grid w-full grid-cols-4 gap-4 p-5">
        {pizzas.map((pizza: Pizza) => (
          <div
            key={pizza.name}
            className="p-5 border rounded-lg shadow-lg border-brown-800"
          >
            <img
              src={pizza2}
              alt="Pizza"
              className="object-contain w-full h-40 mb-4 rounded-md"
            />
            <h2 className="text-lg font-bold">{pizza.name}</h2>
            <p>Crust: {pizza.crust}</p>
            <p>Sauce: {pizza.sauce}</p>
            <p>Cheese: {pizza.cheese}</p>
            <p>
              Toppings:{" "}
              {pizza.toppings && pizza.toppings.length > 0
                ? pizza.toppings.join(", ")
                : "None"}
            </p>

            <p className="font-bold text-green-600">Price: $ {pizza.price}</p>
            <div className="flex gap-2">
              <button
                onClick={() => addToCart(pizza._id ?? "")}
                className="px-4 py-2 text-white bg-blue-700 rounded hover:bg-blue-600"
              >
                <FontAwesomeIcon icon={faShoppingCart} />
              </button>
              <button
                onClick={() => addToFavorites(pizza._id ?? "")}
                className="flex items-center gap-2 px-4 py-2 text-white bg-red-700 rounded hover:bg-red-600"
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
