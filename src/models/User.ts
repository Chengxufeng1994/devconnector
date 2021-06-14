import mongoose from 'mongoose';
const { Schema, model } = mongoose;

interface User {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  date: Date;
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const User = model<User>('User', userSchema);

export default User;
