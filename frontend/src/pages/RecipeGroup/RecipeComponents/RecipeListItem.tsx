import React from "react";

interface RecipeListItemProps {
  title: string;
  description: string;
}

const RecipeListItem = ({ title, description }: RecipeListItemProps) => {
  return (
    <div className="mb-4 p-4 bg-base-200 rounded shadow">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default RecipeListItem;
