import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GroceryList from "./pages/GroceryList";
import Recipes from "./pages/Recipes";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/list" element={<GroceryList />} />
      </Routes>
    </div>
  );
}

export default App;
