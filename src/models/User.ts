import { Schema, model } from "mongoose";

interface IUser {
  name: string,
  email: string,
  points: number
}

const userSchema = new Schema<IUser>({
  name: String,
  email: {
    type: String,
    validate: {
      validator: function(v: string) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: "Invalid email format"
    }
  },
  points: {
    type: Number,
    default: 0,
    min: 0,
    get: (v: number) => Math.round(v),
    set: (v: number) => Math.round(v),
  }
}, { timestamps: true });

export default model<IUser>("User", userSchema);