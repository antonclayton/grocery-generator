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
      <div className="flex flex-col bg-base-100 rounded-lg px-10 py-4 w-full h-full">
        <h1 className="font-bold text-xl xl:text-3xl">{recipe.title}</h1>
        <p className="mt-4 text-sm lg:text-lg xl:text-xl">
          {recipe.description}
        </p>
        <ul className="mt-4 list-disc list-inside">
          {recipe.ingredients.map((item, index) => (
            <li key={index}>
              {item.quantity} {item.unit}{" "}
              {typeof item.ingredientId === "object" &&
              "name" in item.ingredientId
                ? item.ingredientId.name
                : "Unknown ingredient"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeDisplay;
