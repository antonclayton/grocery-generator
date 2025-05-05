import React from "react";
import RecipeListItem from "./RecipeListItem";
import { Recipe } from "../../../types/recipeTypes";

const sampleRecipes = [
  {
    recipeId: "1",
    title: "Sandwich1",
    description: "Italian Sandwich",
    instructions: "Do this and that",
    isFavorite: true,
  },
  {
    recipeId: "2",
    title: "Sandwich2",
    description: "Italian Sandwich",
    instructions: "Do this and that",
    isFavorite: true,
  },
  {
    recipeId: "3",
    title: "Sandwich3",
    description: "Italian Sandwich",
    instructions: "Do this and that",
    isFavorite: true,
  },
  {
    recipeId: "4",
    title: "Sandwich4",
    description: "Italian Sandwich",
    instructions: "Do this and that",
    isFavorite: true,
  },
];

interface RecipeSidebarProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

const RecipeSidebar = ({ recipes, onSelectRecipe }: RecipeSidebarProps) => {
  return (
    <div className="bg-base-300 rounded-lg p-4 w-1/4">
      <div className="flex flex-col bg-base-100 rounded-lg p-4 w-full h-full">
        <h2 className="text-lg font-semibold mb-4">Recipes</h2>
        {/* Example sidebar content */}
        {/* {sampleRecipes &&
          sampleRecipes.map((recipe) => (
            <RecipeListItem
              key={recipe.recipeId}
              title={recipe.title}
              description={recipe.description}
            />
          ))} */}
        {recipes.map((recipe) => (
          <RecipeListItem
            key={recipe._id}
            recipe={recipe}
            onSelectRecipe={onSelectRecipe}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeSidebar;
