import { model, Schema } from 'mongoose';

const shopSchema = new Schema(
  {
    name: { type: String, required: true },
    owner: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: Number, required: true },
    delivery: { type: Boolean, required: true },
  },
);

export const ShopCollection = model('shop', shopSchema);
