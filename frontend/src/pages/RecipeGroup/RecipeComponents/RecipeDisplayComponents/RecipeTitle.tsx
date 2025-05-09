import React from "react";

interface RecipeTitleProps {
  title: string;
  description?: string;
}

const RecipeTitle = ({ title, description }: RecipeTitleProps) => {
  return (
    <div>
      <h1 className="font-bold text-xl xl:text-3xl">{title}</h1>
      <p className="mt-4 text-sm lg:text-lg xl:text-xl">{description}</p>
    </div>
  );
};

export default RecipeTitle;
