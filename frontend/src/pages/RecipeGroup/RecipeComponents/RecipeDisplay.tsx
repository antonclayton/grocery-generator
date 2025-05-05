import React from "react";
import { Recipe } from "../../../types/recipeTypes";

interface RecipeDisplayProps {
  recipe: Recipe | null;
}

const RecipeDisplay = ({ recipe }: RecipeDisplayProps) => {
  if (!recipe) {
    return (
      <div className="flex-1 p-4 font-bold">
        Select a recipe to view details.
      </div>
    );
  }
  return (
    <div className="bg-base-300 rounded-lg flex-1 p-4">
      <div className="flex flex-col items-center bg-base-100 rounded-lg p-4 w-full h-full">
        <h1 className="font-bold text-xl xl:text-3xl">{recipe.title}</h1>
      </div>
    </div>
  );
};

export default RecipeDisplay;
