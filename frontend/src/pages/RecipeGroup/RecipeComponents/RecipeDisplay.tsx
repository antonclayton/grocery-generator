import React from "react";
import { Recipe } from "../../../types/recipeTypes";
import SectionDivider from "../../../components/styling/SectionDivider";
import RecipeTitle from "./RecipeDisplayComponents/RecipeTitle";
import RecipeIngredients from "./RecipeDisplayComponents/RecipeIngredients";
import RecipeInstructions from "./RecipeDisplayComponents/RecipeInstructions";

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
    <div className="bg-base-300 rounded-lg flex-1 p-4 ">
      <div className="flex flex-col bg-base-100 rounded-lg px-4 sm:px-6 lg:px-8 xl:px-10 py-4 w-full h-full">
        <RecipeTitle title={recipe.title} description={recipe.description} />
        <SectionDivider />
        <RecipeIngredients ingredients={recipe.ingredients} />
        <SectionDivider />
        <RecipeInstructions instructions={recipe.instructions} />
      </div>
    </div>
  );
};

export default RecipeDisplay;
