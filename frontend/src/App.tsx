import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GroceryList from "./pages/GroceryList";
import Recipes from "./pages/RecipeGroup/Recipes";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/list" element={<GroceryList />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
