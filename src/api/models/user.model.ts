import mongoose from 'mongoose';
import { validateCPF } from './../../common/validators';
import * as bcrypt from 'bcrypt';
import env from '../../../environment';

enum gender {
  male,
  female,
}

export interface User extends mongoose.Document {
  name?: string | any,
  email?: string | any,
  password?: string | any,
  gender?: gender | any,
  cpf?: string | any,

}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 80,
  },
  email: {
    type: String,
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  gender: {
    type: String,
    required: false,
    enum: ['male', 'female'],
  },
  cpf: {
    type: String,
    required: false,
    unique: true,
    validate: {
      validator: validateCPF,
      message: '{PATH} ({VALUE}) invalid',
    }
  }
});

const hashPassowrd = async (obj: any, next: any) => {
  const salt = await bcrypt.genSalt(env.security.saltRounds);

  bcrypt.hash(obj.password, salt)
    .then((hash) => {
      obj.password = hash;
      next()
    })
    .catch(next)
}

const saveMiddleware = function(this: mongoose.Document, next: any) {
  const user: User = this;

  if (!user.isModified('password')) {
    next();
  } else {
    hashPassowrd(user, next);
  }
};

const updateMiddleware = function(this: mongoose.Query<User>, next: any) {
  if (!this.getUpdate().password) {
    next();
  } else {
    hashPassowrd(this.getUpdate(), next)
  }
}

userSchema.pre('save', saveMiddleware);
userSchema.pre('updateOne', updateMiddleware);

export const User = mongoose.model<User>('User', userSchema);
