import React, { useEffect, useState } from 'react';
import Navbar from '../common/NavBar';
import { useNavigate } from 'react-router-dom';
import { useTokenContext } from '../../contexts/TokenContext';
import Swal from 'sweetalert2';
import axios from 'axios';

const Customize: React.FC = () => {
  const navigate = useNavigate();
  const { userEmail } = useTokenContext();
  const [name, setName] = useState('');
  const [crust, setCrust] = useState('');
  const [sauce, setSauce] = useState('');
  const [cheese, setCheese] = useState('');
  const [toppings, setToppings] = useState<string[]>([]);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userEmail || userEmail === '') {
      navigate('/login');
    }
  }, []);

  const crustOptions = ['Thin Crust', 'Thick Crust', 'Stuffed Crust', 'Kurakkan Crust', 'Rice Flour Crust'];
  const sauceOptions = ['Tomato Basil', 'BBQ', 'Spicy Peri Peri', 'Coconut Sambol Sauce', 'Tikka Masala Sauce'];
  const cheeseOptions = ['Mozzarella', 'Cheddar', 'Parmesan', 'Vegan Cheese'];
  const availableToppings = [
    'Pepperoni',
    'Mushrooms',
    'Onions',
    'Sausage',
    'Bacon',
    'Olives',
    'Green Chilies',
    'Pineapple',
    'Paneer',
  ];

  // Handle topping selection
  const handleToppingChange = (topping: string) => {
    setToppings((prev: string[]) => {
      if (prev.includes(topping)) {
        return prev.filter((t) => t !== topping);
      } else {
        return [...prev, topping];
      }
    });
  };

  const handleCheckPrice = async () => {
    if (!name || !crust || !sauce || !cheese) {
      Swal.fire('Error', 'Please fill out all required fields: name, crust, cheese, and sauce.', 'error');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/pizzas/customize', {
        name: name || 'Custom Pizza',
        crust,
        sauce,
        cheese,
        toppings,
      });
      setPrice(response.data.price);
      Swal.fire({
        title: 'Price Calculation',
        html: `<p>Pizza <strong>${name}</strong> price is LKR ${response.data.price}</p>`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Create and Proceed',
        cancelButtonText: 'Close'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await handleSubmit(response.data.price);
        }
      });
    } catch (err) {
      setError('Failed to calculate price. Please try again.');
      Swal.fire('Error', 'Failed to calculate price. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (pr: number) => {
    setLoading(true);
    setError('');
    if (!name || !crust || !sauce || !cheese) {
      Swal.fire('Error', 'Please fill out all required fields: name, crust, cheese, and sauce.', 'error');
      return;
    }

    const cartItem = {
      userEmail: localStorage.getItem('userEmail'),
      pizzaId: 0,
      pizzaName: name,
      crust: crust,
      sauce: sauce,
      cheese: cheese,
      toppings: toppings.join(', '),
      price: pr,
      quantity: 1,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/cart/add', cartItem);
      if (response.data) {
        console.log({ res2: response.data });
        Swal.fire({
          title: 'Success',
          html: `<p>Pizza <strong>${name}</strong> created successfully!</p><p>Price: LKR ${cartItem.price}</p>`,
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Go to Cart',
          cancelButtonText: 'Close'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/cart');
          }
        });
      } else {
        Swal.fire('Error', 'Failed to add pizza to cart.', 'error');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setCrust('');
    setSauce('');
    setCheese('');
    setToppings([]);
    setPrice(0);
  };

  return (
    <div className="w-[100%] h-[100vh]">
      <Navbar />
      {/* <div className="w-[100%] flex justify-center items-center">
        <div className="mt-5 bg-brown-300 bg-opacity-50 w-[450px] h-[100px] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4 ">

        </div>
      </div> */}
      <div className='w-[100%] flex justify-center items-center'>
        <div className="mt-5 w-[60vw] min-h-[30vh] rounded-xl px-10 py-5 shadow-xl flex flex-col gap-4 ">
          <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Customize Your Pizza</h1>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Pizza Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full"
                required
              />
              <select
                value={crust}
                onChange={(e) => setCrust(e.target.value)}
                className="border p-2 w-full"
                required
              >
                <option value="">Select Crust</option>
                {crustOptions.map((crust) => (
                  <option key={crust} value={crust}>
                    {crust}
                  </option>
                ))}
              </select>
              <select
                value={sauce}
                onChange={(e) => setSauce(e.target.value)}
                className="border p-2 w-full"
                required
              >
                <option value="">Select Sauce</option>
                {sauceOptions.map((sauce) => (
                  <option key={sauce} value={sauce}>
                    {sauce}
                  </option>
                ))}
              </select>
              <select
                value={cheese}
                onChange={(e) => setCheese(e.target.value)}
                className="border p-2 w-full"
                required
              >
                <option value="">Select Cheese</option>
                {cheeseOptions.map((cheese) => (
                  <option key={cheese} value={cheese}>
                    {cheese}
                  </option>
                ))}
              </select>
              <div className="space-y-2">
                <p>Select Toppings:</p>
                {availableToppings.map((topping) => (
                  <label key={topping} className="block">
                    <input
                      type="checkbox"
                      value={topping}
                      checked={toppings.includes(topping)}
                      onChange={() => handleToppingChange(topping)}
                    />
                    {` ${topping}`}
                  </label>
                ))}
              </div>
              <div className='flex justify-end gap-2'>
                <button onClick={handleReset} type="button" className="bg-gray-500 text-white px-4 py-2 rounded ml-2">
                  Reset
                </button>
                <button onClick={handleCheckPrice} type="button" className="bg-blue-700 hover:bg-blue-500 text-white px-4 py-2 rounded">
                  Check Price & Create
                </button>
                {/* <button onClick={() => handleSubmit()} type="button" className="bg-yellow-700 hover:bg-yellow-500 text-white px-4 py-2 rounded">
                        Create Pizza
                    </button> */}

                {loading && <p className="text-blue-500">Creating your pizza...</p>}
                {error && <p className="text-red-500">{error}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
