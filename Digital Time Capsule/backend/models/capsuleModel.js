import mongoose from 'mongoose';

const capsuleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
    },
    images: {
      type: [String],
      default: [],
    },
    video: {
      type: String,
      default: '',
    },
    pdf: {
      type: String,
      default: '',
    },
    unlockDate: {
      type: Date,
      required: [true, 'Please provide an unlock date'],
    },
    visibility: {
      type: String,
      enum: ['private', 'public'],
      default: 'private',
    },
    category: {
      type: String,
      enum: ['Birthday', 'Goals', 'Family', 'Travel', 'Education', 'Career', 'Personal'],
      default: 'Personal',
    },
    tags: {
      type: [String],
      default: [],
    },
    favorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Capsule = mongoose.model('Capsule', capsuleSchema);
export default Capsule;
