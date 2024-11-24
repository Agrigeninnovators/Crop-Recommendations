import React, { useState } from "react";
import axios from "axios";
import MetricsList from "./Components/MetricsList"; // Import the MetricsList component

const App = () => {
  const [cropDetails, setCropDetails] = useState(null);
  const [chatbotResponse, setChatbotResponse] = useState("");
  const [inputs, setInputs] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    phValue: "",
    rainfall: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const predictCrop = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", inputs);
      const { topCrops, chatbotResponse } = response.data; // Adjusted to match the server response structure
      setCropDetails(topCrops);
      setChatbotResponse(chatbotResponse);

      // Scroll to the top of the page after prediction
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error fetching crop prediction:", error);
    }
  };

  const parseChatbotResponse = (response) => {
    // Split into lines, filter out empty lines, and apply bold formatting where `**` is found
    return response
      .split("\n")
      .filter((line) => line.trim() !== "") // Exclude empty lines
      .map((line, index) => (
        <li key={index} style={{ marginBottom: "8px" }}>
          {line.split("**").map((chunk, i) =>
            i % 2 === 1 ? <strong key={i}>{chunk}</strong> : chunk
          )}
        </li>
      ));
  };

  // Styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
    position: "relative",
    zIndex: 1,
    background: "linear-gradient(135deg, #3CB371, #8FBC8F, #FFD700, #FFA500, #228B22, #006400)",
    backgroundSize: "cover",
  };

  const formStyle = {
    display: "grid",
    gridTemplateColumns: "auto auto",
    columnGap: "20px",
    rowGap: "15px",
    padding: "20px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 2,
  };

  const labelStyle = {
    textAlign: "left",
    fontWeight: "bold",
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    width: "100%",
  };

  const buttonStyle = {
    gridColumn: "span 2",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: "#0056b3",
  };

  const chatbotResponseStyle = {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "80%",
    color: "#333",
    zIndex: 2,
    textAlign: "justify",
  };

  const chatbotHeadingStyle = {
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "10px",
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ zIndex: 2 }}>Crop Prediction</h1>

      <div style={formStyle}>
        {Object.keys(inputs).map((key) => (
          <React.Fragment key={key}>
            <label htmlFor={key} style={labelStyle}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            <input
              id={key}
              type="number"
              name={key}
              value={inputs[key]}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </React.Fragment>
        ))}
        <button
          onClick={predictCrop}
          style={buttonStyle}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = buttonStyle.backgroundColor)
          }
        >
          Predict Crop
        </button>
      </div>

      {cropDetails && cropDetails.length > 0 ? (
        <>
          {/* Render the MetricsList component */}
          <MetricsList varieties={cropDetails} />

          {/* New section for chatbot response */}
          <div style={chatbotResponseStyle}>
            <h2 style={chatbotHeadingStyle}>Agri-Gen Recommendations</h2>
            <ul>{parseChatbotResponse(chatbotResponse)}</ul>
          </div>
        </>
      ) : (
        <p>No prediction yet. Please enter crop details.</p>
      )}
    </div>
  );
};

export default App;
