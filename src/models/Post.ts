import mongoose from 'mongoose';

const { Schema, model } = mongoose;

export interface ILikes {
  user: string;
}

export interface IComments {
  [key: string]: string;
  user: string;
  text: string;
  name: string;
  avatar: string;
}

export interface IPost {
  user: string;
  text: string;
  name: string;
  avatar: string;
  likes: ILikes[];
  comments: IComments[];
  date: Date;
}

const postSchema = new Schema<IPost>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Post = model<IPost>('Post', postSchema);

export default Post;
