import React, { useEffect, useState } from 'react';
import Navbar from '../common/NavBar';
import { useNavigate } from 'react-router-dom';
import { useTokenContext } from '../../contexts/TokenContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface OrderItem {
    orderId: string;
    pizzaId: string;
    pizzaName: string;
    crust: string;
    sauce: string;
    cheese: string;
    toppings: string;
    price: number;
    quantity: number;
    state: {
        status: string;
    };
}

const Order: React.FC = () => {
    const navigate = useNavigate();
    const { userEmail } = useTokenContext();
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [updates, setUpdates] = useState<string>('');
    const [message, setMessage] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

    useEffect(() => {
        if (!userEmail || userEmail === '') {
            navigate('/login');
        } else {
            fetchOrders();
        }
    }, [userEmail]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080/order-status');

        ws.onmessage = (event) => {
            console.log('Order Status Update:', event.data);
            setUpdates(event.data);
        };

        return () => ws.close();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:8080/api/orders/${userEmail}`);
            setOrderItems(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setError('Error fetching order items.');
            console.error('Error fetching order items:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIndex = (status: string) => {
        switch (status) {
            case 'Placed':
                return 0;
            case 'Preparing':
                return 1;
            case 'Out for Delivery':
                return 2;
            case 'Delivered':
                return 3;
            default:
                return 0;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;

        const feedback = {
            userEmail,
            pizzaId: selectedOrder.pizzaId,
            pizzaName: selectedOrder.pizzaName,
            orderId: selectedOrder.orderId,
            message: message,
        };

        try {
            await axios.post('http://localhost:8080/api/feedback/submit', feedback);
            alert('Feedback submitted successfully!');
            setMessage('');
            setShowFeedback(false);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback.');
        }
    };

    const openFeedbackPopup = (order: OrderItem) => {
        setSelectedOrder(order);
        setShowFeedback(true);
    };

    const closeFeedbackPopup = () => {
        setShowFeedback(false);
        setMessage('');
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
                            <FontAwesomeIcon icon={faExclamationTriangle} size="4x" className="mb-4" />
                            <p className="text-lg">Your cart is empty.</p>
                        </div>
                    )}
                    <div className="w-full p-5 grid grid-cols-2 gap-4">
                        {Array.isArray(orderItems) && orderItems.map((item, index) => (
                            <div key={index} className="rounded-lg shadow-2xl p-5 bg-brown-100">
                                <h2 className="text-lg font-bold">{item.pizzaName}</h2>
                                <p className="text-green-600 font-bold">Price: LKR {item.price}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Status: {item.state.status}</p>

                                <div className="flex items-center mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${getStatusIndex(item.state.status) >= 0 ? 'bg-brown-500' : ''
                                                }`}
                                            style={{ width: `${(getStatusIndex(item.state.status) + 1) * 25}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {item.state.status === 'Delivered' && (
                                    <div className='flex justify-end'>
                                        <button
                                            onClick={() => openFeedbackPopup(item)}
                                            className="bg-brown-500 text-white px-4 py-2 mt-2 rounded"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-5 w-[50vw]">
                        <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write your feedback here..."
                                className="border p-2 w-full"
                                rows={4}
                            />
                            <div className="flex justify-end gap-3 items-center mt-4">
                                <button
                                    onClick={closeFeedbackPopup}
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="bg-brown-500 text-white px-4 py-2 rounded"
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