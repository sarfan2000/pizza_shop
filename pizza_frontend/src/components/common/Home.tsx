import React from "react";
import Navbar from "./NavBar";

const Home: React.FC = () => {
  return (
    <div className="w-[100%] h-[100vh]">
      {/* Navbar */}
      <Navbar />
      {/* content */}
      <div className="flex justify-center align-center h-[92%] py-5">
        <div className="bg-brown-300 bg-opacity-50 w-[450px] rounded-xl p-5 shadow-xl flex flex-col gap-4 items-center justify-center">
          <h1 className="text-3xl font-bold text-brown-900">Pizza Palette</h1>
          <div className="flex flex-col items-center font-medium text-brown-900">
            <p>Order your favorite pizzas</p>
            <p>quickly and hassle-free!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
