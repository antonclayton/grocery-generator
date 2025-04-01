import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: String,
});

export default mongoose.model("Ingredient", ingredientSchema);
