import React, { useState } from "react";
import "../styles/Login.scss"
import { setLogin } from "../redux/state";
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { apiCall } from "../utils/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      console.log("Attempting login for:", email);
      const data = await apiCall("/auth/login", "POST", { email, password });

      console.log("Login response:", data);

        // Store token and user in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        dispatch(
          setLogin({
            user: data.user,
            token: data.token,
          })
        );
        navigate("/");
    } catch (err) {
      console.log("Login failed", err.message);
      setErrorMessage("Login failed. Please try again later.");
    }
  
  }

  return (
    <div className="login">
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
             {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <button type="submit">LOG IN</button>
        </form>
        <a href="/register">Don't have an account? Sign Up Here</a>
        {/* <a href="/forgot-password" className="forgot-password-link">
          Forgot your password?
        </a> */}
      </div>
    </div>
  );
};

export default LoginPage;
