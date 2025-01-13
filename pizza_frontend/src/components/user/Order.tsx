import React, { useEffect, useState } from "react";
import Navbar from "../common/NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { getAuth } from "firebase/auth";
import { OrderItem } from "../../models/orderItem";

const Order: React.FC = () => {
  const navigate = useNavigate();
  const userEmail = "";
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchFavoriteItems();
  }, []);

  const fetchFavoriteItems = async () => {
    setLoading(true);

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const token = await user.getIdToken();

      const response = await axios.get(
        "http://localhost:3020/api/auth/get-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setOrderItems(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    switch (status) {
      case "Placed":
        return 0;
      case "Shipped":
        return 1;
      case "Delivered":
        return 2;
      default:
        return 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const feedback = {
      userEmail,
    //   pizzaId: selectedOrder.pizzaId,
    //   pizzaName: selectedOrder.pizzaName,
    //   orderId: selectedOrder.orderId,
      message: message,
    };

    try {
      await axios.post("http://localhost:3020/api/feedback/submit", feedback);
      alert("Feedback submitted successfully!");
      setMessage("");
      setShowFeedback(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  const openFeedbackPopup = (order: OrderItem) => {
    setSelectedOrder(order);
    setShowFeedback(true);
  };

  const closeFeedbackPopup = () => {
    setShowFeedback(false);
    setMessage("");
  };

  return (
    <div className="w-[100%] h-[100vh]">
      <Navbar />
      <div className="w-[100%] flex justify-center items-center">
        <div className="mt-5 w-[60vw] min-h-[30vh] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Order Items</h1>
          {loading && <p className="text-blue-500">Loading cart items...</p>}
          {orderItems.length === 0 && !loading && (
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
            {Array.isArray(orderItems) &&
              orderItems.map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-lg shadow-2xl bg-brown-100"
                >
                  <h2 className="text-lg font-bold">Order ID: {item.uid}</h2>
                  <p className="font-bold text-green-600">
                    Total Amount: $ {item.netAmount}
                  </p>
                  <p>Status: {item.status}</p>
                  <p>
                    Order Date: {new Date(item.orderDate).toLocaleDateString()}
                  </p>

                  <div className="mt-4">
                    {item.carts.map((cartItem, cartIndex) => (
                      <div
                        key={cartIndex}
                        className="p-4 mb-4 bg-white border rounded-lg"
                      >
                        <h3 className="font-bold text-md">
                          {cartItem.product.name}
                        </h3>
                        <p>Price: $ {cartItem.totalAmount}</p>
                        <p>Quantity: {cartItem.quantity}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          getStatusIndex(item.status) >= 0 ? "bg-brown-500" : ""
                        }`}
                        style={{
                          width: `${(getStatusIndex(item.status) + 1) * 33.33}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {item.status === "Delivered" && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => openFeedbackPopup(item)}
                        className="px-4 py-2 mt-2 text-white rounded bg-brown-500"
                      >
                        Give Feedback
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {showFeedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 w-[50vw]">
            <h2 className="mb-4 text-2xl font-bold">Submit Feedback</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your feedback here..."
                className="w-full p-2 border"
                rows={4}
              />
              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  onClick={closeFeedbackPopup}
                  className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded bg-brown-500"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
