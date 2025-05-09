import React from "react";
import { RecipeIngredient } from "../../../../types/recipeTypes";

interface RecipeIngredientsProps {
  ingredients: RecipeIngredient[];
}

const RecipeIngredients = ({ ingredients }: RecipeIngredientsProps) => {
  return (
    <div>
      <h2 className="text-lg md:text-xl xl:text-2xl font-bold">Ingredients</h2>
      <ul className="mt-4 list-disc list-inside">
        {ingredients.map((item: RecipeIngredient, index) => (
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
  );
};

export default RecipeIngredients;
