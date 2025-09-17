import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NOpage from "./pages/NOpage";
import Home from "./pages/home";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NOpage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
