import React, { useState, useEffect } from "react";
import { RecipeSidebar, RecipeDisplay } from "./RecipeComponents";
import { Recipe } from "../../types/recipeTypes";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  // const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  console.log(selectedRecipe);

  // fetch recipes (to pass down as props to other components)
  // TODO: Add pagination handling
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/v1/recipes?page=1&limit=10",
          {
            credentials: "include",
          }
        );

        // unauthorized request
        if (res.status === 401) {
          console.warn("Unauthorized — redirecting to login");
          navigate("/"); // navigate to home page
          return;
        }

        const data = await res.json();
        setRecipes(data.recipes);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full bg-base-200 min-h-full p-4 gap-4 ">
      {/* Recipe list side bar */}
      <RecipeSidebar recipes={recipes} onSelectRecipe={setSelectedRecipe} />
      {/* Recipe display */}
      <RecipeDisplay recipe={selectedRecipe} />
    </div>
  );
};

export default Recipes;
