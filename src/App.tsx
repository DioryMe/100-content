import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadDiograph } from "./store/diorySlice";
import { RootState, AppDispatch } from "./store/store";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Grid from "./Grid";
import HomePage from "./homePage";
import ContentSwipes from "./ContentSwipes";
import SetCredentials from "./setCredentials";

// Create a component that uses useLocation to check the current route
const AppContent: React.FC = () => {
  const location = useLocation();

  // If the current route is /welcome, directly render SetCredentials
  if (location.pathname === "/welcome") {
    return <SetCredentials />;
  }

  const dispatch = useDispatch<AppDispatch>();
  const { diograph } = useSelector((state: RootState) => state.diory);

  useEffect(() => {
    if (!diograph) {
      dispatch(loadDiograph());
    }
  }, [diograph, dispatch]);

  if (!diograph) {
    return <div>Loading diograph...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/diory/:focusId/grid" element={<Grid />} />
      <Route path="/diory/:focusId/content" element={<ContentSwipes />} />
      <Route path="/*" element={"Not found"} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
