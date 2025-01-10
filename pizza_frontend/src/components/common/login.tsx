import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/authService";
import Navbar from "./NavBar";
import { useTokenContext } from "../../contexts/TokenContext";
import { usePizzaContext } from "../../contexts/PizzaContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { userEmail, setUserEmail, setUserId } = useTokenContext();
  const { showErrorToast } = usePizzaContext();

  useEffect(() => {
    if (userEmail && userEmail !== '') {
      // Assuming fetchProject is a function you want to call when userEmail is set
     // fetchProject(userEmail);
    }
  }, [userEmail]);

  const handleLogin = async () => {
    try {
      const user = await AuthService.login(email, password);
      setUserEmail(user.data.email);
      setUserId(user.data.uid);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
      showErrorToast("Invalid email or password");
    }
  };

  return (
    <div className="w-full h-[100vh]">
      <Navbar  />
      <div className="flex justify-center align-center h-[92%] py-5">
        <div className="bg-brown-300 bg-opacity-50 w-[450px] rounded-xl p-5 shadow-xl flex flex-col gap-4 items-center justify-center">
          <h1 className="text-3xl font-bold text-brown-900">Login</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 mt-4 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 mt-2 border rounded"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            onClick={handleLogin}
            className="px-4 py-2 mt-4 text-white rounded bg-brown-800"
          >
            Login
          </button>
          <Link to="/signup" className="mt-2 text-brown-900">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;