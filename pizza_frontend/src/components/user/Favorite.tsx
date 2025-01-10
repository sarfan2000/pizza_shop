import React, { useEffect, useState } from 'react';
import Navbar from '../common/NavBar';
import { useNavigate } from 'react-router-dom';
import { useTokenContext } from '../../contexts/TokenContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faShoppingCart, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

interface FavoriteItem {
    pizzaId: string;
    pizzaName: string;
    crust: string;
    sauce: string;
    cheese: string;
    toppings: string;
    price: number;
}

const Favorite: React.FC = () => {
    const navigate = useNavigate();
    const { userEmail } = useTokenContext();
    const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userEmail || userEmail === '') {
            navigate('/login');
        } else {
            fetchFavoriteItems();
        }
    }, [userEmail]);

    const fetchFavoriteItems = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:8080/api/favorites/${userEmail}`);
            setFavoriteItems(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setError('Error fetching favorite items.');
            console.error('Error fetching favorite items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (pizzaName: string) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/favorites/remove/${userEmail}/${pizzaName}`);
            if (response.data) {
                Swal.fire('Success', 'Pizza removed from favorites!', 'success');
                fetchFavoriteItems(); // Refresh the favorite items
            } else {
                Swal.fire('Error', 'Failed to remove pizza from favorites.', 'error');
            }
        } catch (error) {
            console.error('Error removing from favorites:', error);
            Swal.fire('Error', 'Failed to remove pizza from favorites.', 'error');
        }
    };

    const addToCart = async (pizza: FavoriteItem) => {
        const cartItem = {
            userEmail: localStorage.getItem('userEmail'),
            pizzaId: pizza.pizzaId,
            pizzaName: pizza.pizzaName,
            crust: pizza.crust,
            sauce: pizza.sauce,
            cheese: pizza.cheese,
            toppings: pizza.toppings,
            price: pizza.price,
            totalPrice: pizza.price,
            quantity: 1,
        };

        try {
            const response = await axios.post('http://localhost:8080/api/cart/add', cartItem);
            if (response.data) {
                Swal.fire('Success', 'Pizza added to cart!', 'success');
            } else {
                Swal.fire('Error', 'Failed to add pizza to cart.', 'error');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <div className="w-[100%] h-[100vh]">
            <Navbar />

            <h3 className='pt-4 px-4 text-2xl font-bold text-gray-800 flex justify-center'>Favorites</h3>
            <div className="w-[100%] flex justify-center items-center">
                <div className="mt-5 w-[60vw] min-h-[30vh] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4">
                    {loading && <p className="text-blue-500">Loading favorite items...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {favoriteItems.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-16">
                            <FontAwesomeIcon icon={faExclamationTriangle} size="4x" className="mb-4" />
                            <p className="text-lg">Your favorites list is empty.</p>
                        </div>
                    )}
                    <div className="w-full p-5 grid grid-cols-2 gap-4">
                        {Array.isArray(favoriteItems) && favoriteItems.map((item: FavoriteItem, index) => (
                            <div key={index} className="border border-brown-800 rounded-lg shadow-lg p-5">
                                <h2 className="text-lg font-bold">{item.pizzaName}</h2>
                                <p>Crust: {item.crust}</p>
                                <p>Sauce: {item.sauce}</p>
                                <p>Cheese: {item.cheese}</p>
                                <p>Toppings: {item.toppings}</p>
                                <p className="text-green-600 font-bold">Price: LKR {item.price}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="bg-blue-700 hover:bg-blue-500 text-white p-3 rounded mt-4 flex items-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faShoppingCart} />
                                    </button>
                                    <button
                                        onClick={() => handleRemoveFavorite(item.pizzaName)}
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
        </div>
    );
};

export default Favorite;