import * as mongoose from 'mongoose';

interface UserAttrs {
  _id?: string;
  id?: string;
  email: string;
  phone?: string;
  username: string;
  firstName: string;
  lastName: string;
  activated: boolean;
  role: number;
  bio?: string;
  photo?: any;
  cover?: any;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  _id?: string;
  id?: string;
  email: string;
  phone?: string;
  username: string;
  firstName: string;
  lastName: string;
  activated: boolean;
  role: number;
  bio?: string;
  photo?: any;
  cover?: any;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    username: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      default: "",
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    activated: {
      type: Boolean,
      required: true
    },
    photo: {
      type: Object
    },
    cover: {
      type: Object
    },
    role: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
  },
  updatedAt: {
      type: Date,
  },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  const _id = attrs.id
  delete attrs.id
  return new User({
    _id,
    ...attrs
  });
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User, UserDoc, UserAttrs };
