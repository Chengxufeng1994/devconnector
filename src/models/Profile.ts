import mongoose from 'mongoose';
import ExperienceSchema, { IExperience } from './Experience';
import EducationSchema, { IEducation } from './Education';

const { Schema, model } = mongoose;

export type TSocialFields = {
  [key: string]: string;
};

export type TProfileFields = {
  [key: string]: string | number | string[] | TSocialFields;
};

export interface IProfile {
  user: string;
  company: string;
  website: string;
  location: string;
  status: string;
  skills: string[];
  bio: string;
  githubusername: string;
  experience: IExperience[];
  education: IEducation[];
  social: TSocialFields;
}

const profileSchema = new Schema<IProfile>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  company: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    require: true,
  },
  skills: {
    type: [String],
    require: true,
  },
  bio: {
    type: String,
  },
  githubusername: {
    type: String,
  },
  experience: [ExperienceSchema],
  education: [EducationSchema],
  social: {
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    twitter: {
      type: String,
    },
    youtube: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Profile = model<IProfile>('Profile', profileSchema);

export default Profile;
