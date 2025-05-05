import React from "react";
import { Recipe } from "../../../types/recipeTypes";

interface RecipeListItemProps {
  recipe: Recipe;
  onSelectRecipe: (recipe: Recipe) => void;
}

const RecipeListItem = ({ recipe, onSelectRecipe }: RecipeListItemProps) => {
  return (
    <div
      className="mb-4 p-4 bg-base-200 rounded shadow cursor-pointer hover:bg-base-300 transition"
      onClick={() => onSelectRecipe(recipe)}
    >
      <h3 className="text-lg font-bold">{recipe.title}</h3>
      <p className="text-sm">{recipe.description}</p>
    </div>
  );
};

export default RecipeListItem;
