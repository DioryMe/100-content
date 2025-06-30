import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SetCredentials = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    // My Diory room address & basicAuthToken
    const encodedRoomData = params.get("q");
    if (encodedRoomData) {
      try {
        const decodedString = atob(encodedRoomData);
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

    // Archive addresses
    const encodedArchiveData = params.get("a");
    if (encodedArchiveData) {
      try {
        const archiveRooms = atob(encodedArchiveData);
        JSON.parse(archiveRooms);
        if (archiveRooms) {
          localStorage.setItem("archiveRooms", archiveRooms);
        } else {
          console.error("Missing archiveRooms in params");
        }
      } catch (error) {
        console.error("Error decoding or parsing archiveRooms:", error);
      }
    } else {
      console.warn("No archiveRooms param provided!");
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
