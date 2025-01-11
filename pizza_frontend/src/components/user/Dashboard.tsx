import React, { useEffect, useState } from "react";
import Navbar from "../common/NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pizza } from "../../models/pizza";
import pizza2 from "../../assets/pizza2.png";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/authContext";
import { getAuth } from "firebase/auth";

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [offerPizzas, setOfferPizzas] = useState<Pizza[]>([]);

  useEffect(() => {
    fetchAllProductData();
  }, []);

  const fetchAllProductData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

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

  const addToCart = async (pizza: any, isOffer: boolean) => {
    const cartItem = {
      userEmail: localStorage.getItem("userEmail"),
      pizzaId: pizza.pizzaId,
      pizzaName: pizza.name || "Custom Pizza",
      crust: pizza.crust,
      sauce: pizza.sauce,
      cheese: pizza.cheese,
      // toppings: toppings.join(', '),
      toppings: pizza.toppings,
      // price: calculatePrice(),
      price: pizza.price,
      totalPrice: isOffer ? pizza.netPrice : pizza.price,
      quantity: 1,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/cart/add",
        cartItem
      );
      if (response.data) {
        Swal.fire("Success", "Pizza added to cart!", "success");
      } else {
        Swal.fire("Error", "Failed to add pizza to cart.", "error");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const addToFavorites = async (pizza: any, isOffer: boolean) => {
    const favoriteItem = {
      userEmail: localStorage.getItem("userEmail"),
      pizzaId: pizza.pizzaId,
      pizzaName: pizza.name,
      crust: pizza.crust,
      sauce: pizza.sauce,
      cheese: pizza.cheese,
      toppings: pizza.toppings,
      price: isOffer ? pizza.netPrice : pizza.price,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/favorites/add",
        favoriteItem
      );
      if (response.data) {
        Swal.fire("Success", "Pizza added to favorites!", "success");
      } else {
        Swal.fire("Error", "Failed to add pizza to favorites.", "error");
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      Swal.fire("Error", "Failed to add pizza to favorites.", "error");
    }
  };

  return (
    <div className="w-[100%] h-[100vh]">
      <Navbar />

      <h3 className="pt-4 px-4 text-2xl font-bold text-gray-800 flex justify-center">
        Hi {currentUser?.displayName}, Seasonal Offers & Promotions
      </h3>

      <div className="w-full p-5 grid grid-cols-4 gap-4">
        {offerPizzas.map((pizza: Pizza) => (
          <div
            key={pizza._id}
            className="border border-brown-800 rounded-lg shadow-lg p-5"
          >
            <img
              src={pizza2}
              alt="Pizza"
              className="w-full h-40 object-contain rounded-md mb-4"
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

            <div>
              <p className="text-red-600 font-bold">
                Discounted Price: LKR {pizza.netPrice}
              </p>
              <p className="text-gray-500 line-through">
                Original Price: LKR {pizza.price}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => addToCart(pizza, true)}
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <FontAwesomeIcon icon={faShoppingCart} />
              </button>
              <button
                onClick={() => addToFavorites(pizza, true)}
                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <h3 className="pt-4 px-4 text-2xl font-bold text-gray-800 flex justify-center">
        Featured
      </h3>

      <div className="w-full p-5 grid grid-cols-4 gap-4">
        {pizzas.map((pizza: Pizza) => (
          <div
            key={pizza.name}
            className="border border-brown-800 rounded-lg shadow-lg p-5"
          >
            <img
              src={pizza2}
              alt="Pizza"
              className="w-full h-40 object-contain rounded-md mb-4"
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

            <p className="text-green-600 font-bold">Price: LKR {pizza.price}</p>
            <div className="flex gap-2">
              <button
                onClick={() => addToCart(pizza, false)}
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <FontAwesomeIcon icon={faShoppingCart} />
              </button>
              <button
                onClick={() => addToFavorites(pizza, false)}
                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
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
