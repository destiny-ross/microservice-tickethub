import mongoose from "mongoose";
import { Password } from "../utilities/password";

// interface that describes the required properties necessary to create a new user
interface UserAttributes {
  email: string;
  password: string;
}

// interface that describes properties that UserModel has
interface UserModel extends mongoose.Model<UserDocument> {
  build(attributes: UserAttributes): any;
}

// interface that describes properties that a UserDocument has
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attributes: UserAttributes) => {
  return new User(attributes);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
