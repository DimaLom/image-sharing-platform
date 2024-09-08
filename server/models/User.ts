import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  files: [
    {
      type: Schema.Types.ObjectId,
      ref: 'File',
    },
  ],
});

export const User = model('User', userSchema);
