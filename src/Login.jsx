import React, { useState, useEffect } from "react";
import { Input, Card, Typography } from "antd";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import CustomModal from "./Modal";
import "./Login.css";

const { Title } = Typography;

const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "clear"]; // Add "clear" as an additional key

export default function Login() {
  const [rollNo, setRollNo] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  // Key traversal (disabled when modal is visible)
  useEffect(() => {
    if (modalVisible) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % (keys.length + 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [modalVisible]);

  // Handle simulated click when modal is not open
  useEffect(() => {
    const handleClick = () => {
      if (modalVisible) return;

      if (activeIndex === keys.length) {
        handleLogin();
      } else {
        handleKeyClick(keys[activeIndex]);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [activeIndex, modalVisible]);

  const handleKeyClick = (key) => {
    if (key === "clear") {
      setRollNo((prev) => prev.slice(0, -1)); // Remove the last character (backspace)
    } else {
      setRollNo((prev) => prev + key); // Append the key to rollNo
    }
  };

  const handleLogin = async () => {
    if (!rollNo) {
      setModalContent({ title: "Roll No Required", content: "Please enter your roll number." });
      setIsError(true);
      setModalVisible(true);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:5000/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollno: rollNo }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        setModalContent({
          title: "Login Failed",
          content: errorResult.message || "Something went wrong",
        });
        setIsError(true);
        setModalVisible(true);
        setLoading(false);
        return;
      }

      const result = await response.json();
      if (!result.name || !result.class || !result.dob) {
        setModalContent({
          title: "Invalid Response",
          content: "The response from the server is incomplete.",
        });
        setIsError(true);
        setModalVisible(true);
        setLoading(false);
        return;
      }

      setModalContent({
        title: "Confirm Your Details",
        content: (
          <div>
            <p>
              <strong>Name:</strong> {result.name}
            </p>
            <p>
              <strong>Class:</strong> {result.class}
            </p>
            <p>
              <strong>Date of Birth:</strong> {result.dob}
            </p>
          </div>
        ),
      });
      setIsError(false);
      setModalVisible(true);

      // Auto-confirm (simulate OK button) after 3 seconds
      const timeout = setTimeout(() => {
        Cookies.set("rollno", rollNo, { expires: 7 });
        setModalVisible(false);
        navigate("/game");
      }, 3000);

      return () => clearTimeout(timeout);
    } catch (error) {
      setModalContent({
        title: "Network Error",
        content: "Unable to connect to the server.",
      });
      setIsError(true);
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-keypad-container">
      <Card className="login-keypad-card">
        <Title level={3} className="login-keypad-title">
          Login with Roll No
        </Title>

        <Input
          className="login-keypad-input"
          value={rollNo}
          placeholder="Enter Roll No"
          disabled
        />

        <div className="login-keypad-grid">
          {keys.map((key, index) => (
            <button
              key={key}
              className={`login-keypad-key ${activeIndex === index ? "active" : ""}`}
              onClick={() => handleKeyClick(key)}
            >
              {key === "clear" ? "❌" : key}
            </button>
          ))}
          <button
            className={`login-keypad-login-btn ${
              activeIndex === keys.length ? "active" : ""
            }`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </div>
      </Card>

      <CustomModal
        isVisible={modalVisible}
        title={modalContent.title}
        content={modalContent.content}
        onOk={() => {
          Cookies.set("rollno", rollNo, { expires: 7 });
          setModalVisible(false);
          navigate("/game");
        }}
        onCancel={() => setModalVisible(false)}
        isError={isError}
      />
    </div>
  );
}
