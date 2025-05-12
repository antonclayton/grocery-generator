// CUSTOM HOOK:
// - returns: recipes, ingredients, and categories from DB
// hooks/useFetchData.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Recipe, Ingredient, RecipeCategory } from "../types/recipeTypes";

const useFetchRecipeData = () => {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories, setCategories] = useState<RecipeCategory[]>([]);
  const [loading, setLoading] = useState(true);

  //   console.log(recipes);
  //   console.log(ingredients);
  //   console.log(categories);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: ADD PAGINATION HANDLING
        // Fetch recipes
        const recipesRes = await fetch(
          "http://localhost:3000/api/v1/recipes?page=1&limit=10",
          {
            credentials: "include",
          }
        );

        if (recipesRes.status === 401) {
          console.warn("Unauthorized — redirecting to login");
          navigate("/"); // Redirect to login page on unauthorized
          return;
        }

        const recipesData = await recipesRes.json();
        setRecipes(recipesData.recipes);

        // Fetch ingredients
        const ingredientsRes = await fetch(
          "http://localhost:3000/api/v1/ingredients",
          {
            credentials: "include",
          }
        );

        // console.log(ingredientsRes);
        const ingredientsData = await ingredientsRes.json();
        // console.log(ingredientsData);
        setIngredients(ingredientsData);

        // Fetch categories
        const categoriesRes = await fetch(
          "http://localhost:3000/api/v1/recipes/categories",
          {
            credentials: "include",
          }
        );

        // console.log(categoriesRes);
        const categoriesData = await categoriesRes.json();
        // console.log(categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return { recipes, ingredients, categories, loading };
};

export default useFetchRecipeData;
