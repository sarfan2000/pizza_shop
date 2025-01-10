import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface CartItem {
    pizzaId?: string;
    pizzaName: string;
    crust: string;
    sauce: string;
    cheese: string;
    toppings: string;
    price: number;
    totalPrice: number;
    quantity: number;
}

interface CheckoutProps {
    cartItems: CartItem[];
    totalAmount: number;
    onClose: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalAmount, onClose }) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [specialPackaging, setSpecialPackaging] = useState(false);
    const navigate = useNavigate();
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({
        mobileNumber: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        const firstItem = cartItems[0];

        const orderDetails = {
            userEmail: localStorage.getItem('userEmail'),
            mobile: mobileNumber,
            pizzaId: firstItem.pizzaId ?? 0,
            pizzaName: firstItem.pizzaName,
            crust: firstItem.crust,
            sauce: firstItem.sauce,
            cheese: firstItem.cheese,
            toppings: firstItem.toppings,
            price: firstItem.totalPrice,
            quantity: firstItem.quantity,
            specialPackaging: specialPackaging
        };

        try {
            const response = await axios.post('http://localhost:8080/api/orders/create', orderDetails);
            if (response.data) {
                Swal.fire('Success', 'Payment successful!', 'success');
                onClose();
                navigate('/orders');
            } else {
                Swal.fire('Error', 'Failed to create order.', 'error');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order.');
        }
    };

    const validateMobileNumber = (value: string) => {
        const regex = /^[0-9]{10}$/;
        return regex.test(value) ? '' : 'Please enter a valid 10-digit mobile number';
    };

    const validateCardNumber = (value: string) => {
        const regex = /^[0-9]{16}$/;
        return regex.test(value) ? '' : 'Please enter a valid 16-digit card number';
    };

    const validateExpiryDate = (value: string) => {
        const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        return regex.test(value) ? '' : 'Please enter a valid expiry date in MM/YY format';
    };

    const validateCvv = (value: string) => {
        const regex = /^[0-9]{3,4}$/;
        return regex.test(value) ? '' : 'Please enter a valid 3 or 4-digit CVV';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let error = '';

        switch (name) {
            case 'mobileNumber':
                error = validateMobileNumber(value);
                setMobileNumber(value);
                break;
            case 'cardNumber':
                error = validateCardNumber(value);
                setCardNumber(value);
                break;
            case 'expiryDate':
                error = validateExpiryDate(value);
                setExpiryDate(value);
                break;
            case 'cvv':
                error = validateCvv(value);
                setCvv(value);
                break;
            default:
                break;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="relative bg-brown-100 rounded-lg p-5 w-[50vw]">
                <div className='flex justify-between items-center'>
                    <h2 className="text-2xl font-bold">Checkout</h2>
                    <h3 className="text-xl font-bold">Total Amount: LKR {totalAmount}</h3>
                </div>
                <div className="w-full p-5 grid grid-cols-1 gap-4">
                    {cartItems.map((item) => (
                        <div key={item.pizzaName} className="rounded-lg shadow-2xl p-5 bg-brown-100">
                            <h2 className="text-lg font-bold">{item.pizzaName}</h2>
                            <p className="text-green-600 font-bold">Price: LKR {item.totalPrice}</p>
                            <p>Quantity: {item.quantity}</p>
                        </div>
                    ))}
                </div>

                <form onSubmit={handlePayment} className="mt-4">
                    <div className="mb-4 flex gap-2">
                        <input
                            type="checkbox"
                            id="specialPackaging"
                            name="specialPackaging"
                            checked={specialPackaging}
                            onChange={(e) => setSpecialPackaging(e.target.checked)}
                        />
                        <label className="block text-gray-700 text-sm font-bold" htmlFor="specialPackaging">
                            Special Packaging
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobileNumber">
                            Mobile Number
                        </label>
                        <input
                            type="text"
                            id="mobileNumber"
                            name="mobileNumber"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={mobileNumber}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.mobileNumber && <p className="text-red-500 text-xs italic">{errors.mobileNumber}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardNumber">
                            Card Number
                        </label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={cardNumber}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.cardNumber && <p className="text-red-500 text-xs italic">{errors.cardNumber}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expiryDate">
                            Expiry Date (MM/YY)
                        </label>
                        <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={expiryDate}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.expiryDate && <p className="text-red-500 text-xs italic">{errors.expiryDate}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cvv">
                            CVV
                        </label>
                        <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={cvv}
                            onChange={handleInputChange}
                            required
                        />
                        {errors.cvv && <p className="text-red-500 text-xs italic">{errors.cvv}</p>}
                    </div>
                    <div className="flex justify-end gap-3 items-center mt-4">
                        <button
                            onClick={onClose}
                            className="bg-gray-700 hover:bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="bg-brown-700 hover:bg-brown-500 text-white px-4 py-2 rounded"
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