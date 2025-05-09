import React from "react";

interface RecipeInstructionsProps {
  instructions?: string;
}

const RecipeInstructions = ({ instructions }: RecipeInstructionsProps) => {
  if (!instructions) {
    return (
      <div className="text-sm md:text-md lg:text-lg font-bold">
        No instructions for this recipe
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-lg md:text-xl xl:text-2xl font-bold">Instructions</h2>
      <p className="mt-4">{instructions}</p>
    </div>
  );
};

export default RecipeInstructions;
