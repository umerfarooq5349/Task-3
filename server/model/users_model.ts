import mongoose, { Document, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  role: string;
  active: boolean;
  photo: string;
  checkPassword(password: string, hashedPassword: string): Promise<boolean>;
}

export interface UserModel extends Model<UserDocument> {
  checkPassword(password: string, hashedPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument, UserModel>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (this: UserDocument, el: string) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
  },
  photo: {
    type: String,
    required: true,
    default: "image.jpg",
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if the password is actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Clear the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = function (
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
