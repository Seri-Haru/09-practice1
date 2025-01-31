import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import WelcomePage from "./components/WelcomePage";
import WeatherPage from "./components/WeatherPage";
import SunnyCitiesPage from "./components/SunnyCitiesPage";

function App() {
  return (
    <Router>
      <Header />  {/* Headerコンポーネントをここで表示 */}
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/sunny-cities" element={<SunnyCitiesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
