import mongoose, { Schema } from "mongoose";

const favoriteSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  product: { type: Schema.Types.ObjectId, ref: "product", required: true },
});

const Favorite = mongoose.model("favorite", favoriteSchema);

export default Favorite;
