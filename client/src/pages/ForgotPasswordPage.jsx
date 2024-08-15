import React, { useState } from "react";
import { apiCall } from "../utils/api";
// import "../styles/ForgotPassword.scss";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiCall("/auth/forgot-password", "POST", { email });
      setMessage("Password reset link sent to your email");
    } catch (err) {
      console.log("Failed to send password reset link", err.message);
      setMessage("Failed to send password reset link. Please try again later.");
    }
  };

  return (
    <div className="forgot-password">
      <div className="forgot-password_content">
        <form className="forgot-password_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
