import React, { useEffect, useState } from "react";
import Navbar from "../common/NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faPlus,
  faMinus,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import Checkout from "./Checkout";
import { getAuth } from "firebase/auth";
import { CartItem } from "../../models/cartItem";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchAllCartItem();
  }, []);

  const fetchAllCartItem = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const token = await user.getIdToken();

      const response = await axios.get(
        "http://localhost:3020/api/auth/get-cart-items",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCartItems(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const token = await user?.getIdToken();
      const response = await axios.delete(
        `http://localhost:3020/api/auth/remove-cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        Swal.fire("Success", "Pizza removed from cart!", "success");
        fetchAllCartItem(); // Refresh the cart items
      } else {
        Swal.fire("Error", "Failed to remove pizza from cart.", "error");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      Swal.fire("Error", "Failed to remove pizza from cart.", "error");
    }
  };

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    try {
      const token = await user?.getIdToken();
      const response = await axios.put(
        `http://localhost:3020/api/auth/update-cart-item/${productId}`,
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        fetchAllCartItem(); // Refresh the cart items
      } else {
        Swal.fire("Error", "Failed to update quantity.", "error");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      Swal.fire("Error", "Failed to update quantity.", "error");
    }
  };

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.totalAmount, 0);
  };

  return (
    <div className="w-[100%] h-[100vh]">
      <Navbar />
      <h3 className="flex justify-center px-4 pt-4 text-2xl font-bold text-gray-800">
        My Cart
      </h3>
      <div className="w-[100%] flex justify-center items-center">
        <div className="mt-5 w-[60vw] min-h-[30vh] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowCheckout(true)}
              className="px-4 py-2 text-white bg-green-700 rounded hover:bg-green-500"
            >
              Checkout (Total: $ {calculateTotalAmount()})
            </button>
          </div>
          {cartItems.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center text-gray-500">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                size="4x"
                className="mb-4"
              />
              <p className="text-lg">Your cart is empty.</p>
            </div>
          )}
          <div className="grid w-full grid-cols-2 gap-4 p-5">
            {Array.isArray(cartItems) &&
              cartItems.map((item: CartItem) => (
                <div
                  key={item.product._id}
                  className="p-5 border rounded-lg shadow-lg border-brown-800"
                >
                  <h2 className="text-lg font-bold">{item.product.name}</h2>
                  <p>Crust: {item.product.crust}</p>
                  <p>Sauce: {item.product.sauce}</p>
                  <p>Cheese: {item.product.cheese}</p>
                  <p>Toppings: {item.product.toppings}</p>
                  <p className="font-bold text-green-600">
                    Price: $ {item.totalAmount}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id ?? "",
                            item.quantity - 1
                          )
                        }
                        className="px-2 py-1 text-black bg-gray-300 rounded hover:bg-gray-400"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <p>Quantity: {item.quantity}</p>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product._id ?? "",
                            item.quantity + 1
                          )
                        }
                        className="px-2 py-1 text-black bg-gray-300 rounded hover:bg-gray-400"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.product._id ?? "")}
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
      {showCheckout && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-[50vw]">
            <Checkout
              cartItems={cartItems}
              totalAmount={calculateTotalAmount()}
              onClose={() => setShowCheckout(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
