// Recipe interfaces here mimic the Schema/interfaces in the backend
export interface Ingredient {
  _id: string;
  name: string;
  category: string;
  userId: string;
}

export interface RecipeIngredient {
  ingredientId: string | Ingredient; // Send as stringified ObjectId
  quantity: number;
  unit: string;
}

export interface Recipe {
  _id: string; // MongoDB ObjectId comes back as "_id" in API responses
  userId: string;
  title: string;
  description?: string;
  ingredients: RecipeIngredient[];
  instructions?: string;
  categories?: string[]; // Array of ObjectIds as strings
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeCategory {
  _id: string;
  name: string;
  userId: string;
}
