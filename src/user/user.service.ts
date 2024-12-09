import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { User, UserAttrs, UserDoc } from './models/user.model';
import { UserType } from '@htkradass/nestcommon';
const mongoose = require('mongoose');

@Injectable()
export class UserService {
  constructor(
  ) { }

  async createOrUpdate(userData: UserType) {
    const foundUser = await User.findById(userData.id);
    let createdOrUpdated: UserDoc;
    if (foundUser) {
      // to update
      createdOrUpdated = await User.findByIdAndUpdate(foundUser.id, userData, { new: true });
    } else {
      // to create
      const newUser: UserAttrs = {
        _id: userData.id,
        ...userData,
      }
      createdOrUpdated = await User.create(newUser);
    }

    return createdOrUpdated.toJSON();
  }

  async update(userData: Partial<UserType>) {
    const foundUser = await User.findById(userData.id);
    if (!foundUser) {
      return this.createOrUpdate(userData as UserType);
    }
    const updated = await User.findByIdAndUpdate(foundUser.id, userData, { new: true });
    return updated.toJSON();
  }

  async findById(id: ObjectId): Promise<UserDoc> {
    return (await User.findById(id)).toJSON() as UserDoc;
  }

  async getLatest() {
    const user = await User.find().sort({ _id: -1 }).limit(1);
    return user;
  }

  async findUserById(userId) {
    const user = await User.findById(userId);
    let findUser
    if (user) {
      findUser = [user?.toJSON()]
    } else {
      findUser = []
    }
    return findUser
  }


  async syncUsers(params) {

    if (params?.users.length > 0) {
      console.log(params.users);
      for (let i = 0; i < params.users.length; i++) {
        let user = {
          id: params.users[i].id,
          email: params.users[i].email,
          username: params.users[i].username,
          firstName: params.users[i].firstName,
          lastName: params.users[i].lastName,
          bio: params.users[i].bio,
          phone: params.users[i].phone,
          activated: params.users[i].activated,
          role: params.users[i].role,
          photo: params.users[i].photo || null,
          cover: params.users[i].cover || null,
          createdAt: params.users[i].createdAt,
          updatedAt: params.users[i].updatedAt,
        };
        this.createOrUpdate(user)
      }

    }

    return { status: true };
  }


}
