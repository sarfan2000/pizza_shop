import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Pizza } from "../../models/pizza";
import { getAuth } from "firebase/auth";

interface CartItem {
  _id: string;
  uid: string;
  product: Pizza;
  quantity: number;
  totalAmount: number;
}

interface CheckoutProps {
  cartItems: CartItem[];
  totalAmount: number;
  onClose: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({
  cartItems,
  totalAmount,
  onClose,
}) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [specialPackaging, setSpecialPackaging] = useState(false);
  const navigate = useNavigate();
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({
    mobileNumber: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const auth = getAuth();
  const user = auth.currentUser;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const cart=cartItems.map((item)=>({
      _id:item._id,
    }))
    const data = {
      cartItems: cart,
      totalAmount: totalAmount,
    };

    try {
      const token = await user?.getIdToken();

      const response = await axios.post(
        "http://localhost:3020/api/auth/orders/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        Swal.fire("Success", "Payment successful!", "success");
        onClose();
        navigate("/orders");
      } else {
        Swal.fire("Error", "Failed to create order.", "error");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order.");
    }
  };

  const validateMobileNumber = (value: string) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(value)
      ? ""
      : "Please enter a valid 10-digit mobile number";
  };

  const validateCardNumber = (value: string) => {
    const regex = /^[0-9]{16}$/;
    return regex.test(value) ? "" : "Please enter a valid 16-digit card number";
  };

  const validateExpiryDate = (value: string) => {
    const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    return regex.test(value)
      ? ""
      : "Please enter a valid expiry date in MM/YY format";
  };

  const validateCvv = (value: string) => {
    const regex = /^[0-9]{3,4}$/;
    return regex.test(value) ? "" : "Please enter a valid 3 or 4-digit CVV";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "mobileNumber":
        error = validateMobileNumber(value);
        setMobileNumber(value);
        break;
      case "cardNumber":
        error = validateCardNumber(value);
        setCardNumber(value);
        break;
      case "expiryDate":
        error = validateExpiryDate(value);
        setExpiryDate(value);
        break;
      case "cvv":
        error = validateCvv(value);
        setCvv(value);
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const isFormValid = () => {
    return (
      !errors.mobileNumber &&
      !errors.cardNumber &&
      !errors.expiryDate &&
      !errors.cvv &&
      mobileNumber &&
      cardNumber &&
      expiryDate &&
      cvv
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-brown-100 rounded-lg p-5 w-[50vw]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <h3 className="text-xl font-bold">Total Amount: $ {totalAmount}</h3>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 p-5">
          {cartItems.map((item) => (
            <div
              key={item.product._id}
              className="p-5 rounded-lg shadow-2xl bg-brown-100"
            >
              <h2 className="text-lg font-bold">{item.product.name}</h2>
              <p className="font-bold text-green-600">
                Price: $ {item.totalAmount}
              </p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handlePayment} className="mt-4">
          <div className="flex gap-2 mb-4">
            <input
              type="checkbox"
              id="specialPackaging"
              name="specialPackaging"
              checked={specialPackaging}
              onChange={(e) => setSpecialPackaging(e.target.checked)}
            />
            <label
              className="block text-sm font-bold text-gray-700"
              htmlFor="specialPackaging"
            >
              Special Packaging
            </label>
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="mobileNumber"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              value={mobileNumber}
              onChange={handleInputChange}
              required
            />
            {errors.mobileNumber && (
              <p className="text-xs italic text-red-500">
                {errors.mobileNumber}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="cardNumber"
            >
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              value={cardNumber}
              onChange={handleInputChange}
              required
            />
            {errors.cardNumber && (
              <p className="text-xs italic text-red-500">{errors.cardNumber}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="expiryDate"
            >
              Expiry Date (MM/YY)
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              value={expiryDate}
              onChange={handleInputChange}
              required
            />
            {errors.expiryDate && (
              <p className="text-xs italic text-red-500">{errors.expiryDate}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="cvv"
            >
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              value={cvv}
              onChange={handleInputChange}
              required
            />
            {errors.cvv && (
              <p className="text-xs italic text-red-500">{errors.cvv}</p>
            )}
          </div>
          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white bg-gray-700 rounded hover:bg-gray-500"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded bg-brown-700 hover:bg-brown-500"
              disabled={!isFormValid()}
            >
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
