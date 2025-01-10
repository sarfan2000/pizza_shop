import React, { useEffect, useState } from 'react';
import Navbar from '../common/NavBar';
import { useNavigate } from 'react-router-dom';
import { useTokenContext } from '../../contexts/TokenContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faMinus, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Checkout from './Checkout';

interface CartItem {
    pizzaName: string;
    crust: string;
    sauce: string;
    cheese: string;
    toppings: string;
    price: number;
    totalPrice: number;
    quantity: number;
}

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const { userEmail } = useTokenContext();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showCheckout, setShowCheckout] = useState(false);

    useEffect(() => {
        if (!userEmail || userEmail === '') {
            navigate('/login');
        } else {
            fetchCartItems();
        }
    }, [userEmail]);

    const fetchCartItems = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:8080/api/cart/get/${userEmail}`);
            setCartItems(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            setError('Error fetching cart items.');
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (pizzaName: string) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/cart/remove/${userEmail}/${pizzaName}`);
            if (response.data) {
                Swal.fire('Success', 'Pizza removed from cart!', 'success');
                fetchCartItems(); // Refresh the cart items
            } else {
                Swal.fire('Error', 'Failed to remove pizza from cart.', 'error');
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            Swal.fire('Error', 'Failed to remove pizza from cart.', 'error');
        }
    };

    const handleQuantityChange = async (pizzaName: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            const response = await axios.put(`http://localhost:8080/api/cart/update/${userEmail}/${pizzaName}`, {
                quantity: newQuantity,
            });
            if (response.data) {
                fetchCartItems(); // Refresh the cart items
            } else {
                Swal.fire('Error', 'Failed to update quantity.', 'error');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            Swal.fire('Error', 'Failed to update quantity.', 'error');
        }
    };

    const calculateTotalAmount = () => {
        return cartItems.reduce((total, item) => total + item.totalPrice, 0);
    };

    return (
        <div className="w-[100%] h-[100vh]">
            <Navbar />
            <h3 className='pt-4 px-4 text-2xl font-bold text-gray-800 flex justify-center'>My Cart</h3>
            <div className="w-[100%] flex justify-center items-center">
                <div className="mt-5 w-[60vw] min-h-[30vh] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowCheckout(true)}
                            className="bg-green-700 hover:bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Checkout (Total: LKR {calculateTotalAmount()})
                        </button>
                    </div>
                    {loading && <p className="text-blue-500">Loading cart items...</p>}
                    {cartItems.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center text-center text-gray-500">
                            <FontAwesomeIcon icon={faExclamationTriangle} size="4x" className="mb-4" />
                            <p className="text-lg">Your cart is empty.</p>
                        </div>
                    )}
                    <div className="w-full p-5 grid grid-cols-2 gap-4">
                        {Array.isArray(cartItems) && cartItems.map((item: CartItem) => (
                            <div key={item.pizzaName} className="border border-brown-800 rounded-lg shadow-lg p-5">
                                <h2 className="text-lg font-bold">{item.pizzaName}</h2>
                                <p>Crust: {item.crust}</p>
                                <p>Sauce: {item.sauce}</p>
                                <p>Cheese: {item.cheese}</p>
                                <p>Toppings: {item.toppings}</p>
                                <p className="text-green-600 font-bold">Price: LKR {item.totalPrice}</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleQuantityChange(item.pizzaName, item.quantity - 1)}
                                            className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
                                        >
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <p>Quantity: {item.quantity}</p>
                                        <button
                                            onClick={() => handleQuantityChange(item.pizzaName, item.quantity + 1)}
                                            className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item.pizzaName)}
                                        className="bg-red-700 hover:bg-red-500 text-white p-3 rounded mt-4 flex items-center gap-2"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-5 w-[50vw]">
                        <Checkout cartItems={cartItems} totalAmount={calculateTotalAmount()} onClose={() => setShowCheckout(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;