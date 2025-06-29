import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SetCredentials = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const encodedData = params.get("q");
    if (encodedData) {
      try {
        const decodedString = atob(encodedData);
        const credentials = JSON.parse(decodedString);
        const { roomAddress, basicAuthToken } = credentials;
        if (roomAddress && basicAuthToken) {
          localStorage.setItem("roomAddress", roomAddress);
          localStorage.setItem("basicAuthToken", basicAuthToken);
        } else {
          console.error("Missing roomAddress or basicAuthToken in credentials");
        }
      } catch (error) {
        console.error("Error decoding or parsing credentials:", error);
      }
    } else {
      console.warn("No credentials query param provided!");
    }
    // Redirect to home page
    window.location.href = "/";
  }, [location.search, navigate]);

  return (
    <div>
      <p>Setting credentials... Please wait</p>
    </div>
  );
};

export default SetCredentials;
