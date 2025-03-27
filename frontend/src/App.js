import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./App.css";
import AddEditItems from "./AddEditItems/AddEditItems";
import DisplayItems from "./DisplayItems/DisplayItems";
import RecipePage from "./RecipePage/RecipePage";

// Homepage component
const Homepage = () => (
  <div>
    {/* Eat Fresh Image and Heading Centered */}
    <div className="flex flex-col items-center mb-8">
      <img
        src="/images/East_Fresh.png"
        alt="Easy Inventory Tracking"
        className="w-130 h-80"
      />
      <h1 className="text-5xl font-bold text-gray-800 mt-4">Track, Cook, Enjoy!</h1>
      <p className="text-lg text-gray-600 mt-2">
        Your smart grocery companion get recipe suggestions, track expiry dates, and reduce food waste!
      </p>
    </div>

    {/* Feature Images in Grid */}
    <div className="grid grid-cols-2 gap-8">
      <div className="relative group">
        <img
          src="/images/grocery_cart.jpg"
          alt="Easy Inventory Tracking"
          className="w-full h-auto rounded-t-xl"
        />
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <h2 className="text-2xl font-semibold">🛒 Easy Inventory Tracking</h2>
          <p className="text-gray-200">Monitor what you have at home, track expiry dates, and avoid waste.</p>
        </div>
      </div>

      <div className="relative group">
        <img
          src="/images/cake recipe.jpg"
          alt="Recipe Suggestions"
          className="w-full h-auto rounded-t-xl"
        />
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <h2 className="text-2xl font-semibold">🍽️ Recipe Suggestions</h2>
          <p className="text-gray-200">Get personalized recipes based on the items about to expire.</p>
        </div>
      </div>

      <div className="relative group">
        <img
          src="/images/Expire_Date.png"
          alt="Expiry Alerts"
          className="w-full h-auto rounded-t-xl"
        />
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <h2 className="text-2xl font-semibold">⏰ Expiry Alerts</h2>
          <p className="text-gray-200">Receive timely notifications so you never waste food again.</p>
        </div>
      </div>

      <div className="relative group">
        <img
          src="/images/pantry.jpg"
          alt="Pantry Management"
          className="w-full h-auto rounded-t-xl"
        />
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <h2 className="text-2xl font-semibold">💡 Smart Recommendations</h2>
          <p className="text-gray-200">AI-powered suggestions tailored to your pantry's needs.</p>
        </div>
      </div>
    </div>
  </div>
);

// Main App component
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/getitem" element={<DisplayItems />} />
        <Route path="/edititem" element={<AddEditItems />} />
        <Route path="/edititem/:id" element={<AddEditItems />} />
        <Route path="/recipe" element={<RecipePage />} />
        <Route path="*" element={<Homepage />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);