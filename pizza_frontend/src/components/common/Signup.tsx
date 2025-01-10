import React, { useEffect, useState } from 'react';
import { Link,  } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import Navbar from './NavBar';
import { usePizzaContext } from '../../contexts/PizzaContext';
//import { User } from '../../models/user';

const Signup: React.FC = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { showErrorToast, showSuccessToast } = usePizzaContext();

  useEffect(() => {
    // if (userEmail || userEmail !== '') {
    //   localStorage.clear();
    //   setUserEmail('');
    //   setUserId('');
    // }
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      showErrorToast('Passwords do not match!');
      return;
    }
    try {
      // const newUser: User = {
      //   name: name,
      //   email: email,
      //   mobile: mobile,
      //   password: password,
      // };
      const response = await AuthService.signup(email,password);
      if (response.success) {
        showSuccessToast('You have successfully signed-up');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Please try again.');
      showErrorToast('Sign-up failed. Please try again.');
    }
  };

  return (
    <div className="w-[100%] h-[100vh]">
      {/* Navbar */}
      <Navbar />
      <div className="w-[100%] h-[92vh] flex justify-center items-center">
        <div className="bg-brown-300 bg-opacity-50 w-[450px] rounded-xl px-10 py-7 shadow-xl flex flex-col gap-4 ">
          <h2 className="flex items-center justify-center text-2xl font-bold">Sign-up</h2>
          <form onSubmit={handleSignup}>
            <div className="flex w-[100%] gap-2 mt-4 mb-6 items-center">
              <label htmlFor="name" className="w-[20%]">Name</label>
              <input
                type="name"
                id="name"
                className="w-[80%] py-2 px-3 rounded-lg bg-brown-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex w-[100%] gap-2 mt-4 mb-6 items-center">
              <label htmlFor="email" className="w-[20%]">Email</label>
              <input
                type="email"
                id="email"
                className="w-[80%] py-2 px-3 rounded-lg bg-brown-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex w-[100%] gap-2 mb-6 items-center">
              <label htmlFor="email" className="w-[20%]">Mobile</label>
              <input
                type="text"
                id="mobile"
                className="w-[80%] py-2 px-3 rounded-lg bg-brown-100"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
            <div className="flex w-[100%] gap-2 mb-6 items-center">
              <label htmlFor="password" className="w-[20%]">Password</label>
              <input
                type="password"
                id="password"
                className="w-[80%] py-2 px-3 rounded-lg bg-brown-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex w-[100%] gap-2 mb-6 items-center">
              <label htmlFor="password" className="w-[20%]">Confirm Password</label>
              <input
                type="password"
                id="password"
                className="w-[80%] py-2 px-3 rounded-lg bg-brown-100"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-center mt-5">
              <button type="submit" className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white border border-transparent rounded-lg gap-x-2 bg-brown-900 hover:bg-brown-600">
                Register
              </button>
            </div>
            <div className="mt-3 text-center">
              {error && <div className="mt-3 alert alert-danger">{error}</div>}
              <span>Already have an account? </span>
              <Link to="/login" className="text-blue-500 underline">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
