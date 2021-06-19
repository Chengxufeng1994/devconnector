import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  date: Date;
}

const userSchema = new Schema<IUser>({
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

const User = model<IUser>('User', userSchema);

export default User;
