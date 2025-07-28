import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import "../styles/ResetPassword.scss";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:3001/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successfully");
        navigate("/login");
      } else {
        setMessage(data.message || "Failed to reset password");
      }
    } catch (err) {
      console.log("Failed to reset password", err.message);
      setMessage("Failed to reset password. Please try again later.");
    }
  };

  return (
    <div className="reset-password">
      <div className="reset-password_content">
        <form className="reset-password_content_form" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
