import React, { useState } from "react";
import "../styles/Login.scss"
import { setLogin } from "../redux/state";
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch ("http://127.0.0.1:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      /* Get data after fetching */
      const data = await response.json();

      if (response.ok) {
        dispatch(
          setLogin({
            user: data.user,
            token: data.token,
          })
        );
        navigate("/");
      } else {
        setErrorMessage(data.message || "Login failed");
      }
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
        <a href="/register">Don't have an account? Sign In Here</a>
        {/* <a href="/forgot-password" className="forgot-password-link">
          Forgot your password?
        </a> */}
      </div>
    </div>
  );
};

export default LoginPage;
