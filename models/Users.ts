import { Meteor } from 'meteor/meteor';

import { User, UpdateUserData } from '../lib/types/User';
import { Base } from './Base';

class Users extends Base {
  constructor() {
    super('users', Meteor.users as any);
  }

  public addUser(record: User): string {
    return this.insert(record);
  }

  public setName(userId: string, name: string): void {
    this.update({
      _id: userId,
    }, {
      $set: {
        name,
      },
    });
  }

  public findOneByEmail(email: string): User | undefined {
    const query = {
      'emails.address': email,
    };

    const user = this.findOne(query);
    if (user) {
      return user as User;
    }
  }

  public countAdmins(): number {
    const query = {
      admin: true,
    };

    return this.find(query).count();
  }

  public like(uid: string, userId: string): void {
    const query = {
      _id: uid,
    };

    const data = {
      $addToSet: {
        'reactions.like': userId,
      },
    };

    this.update(query, data);
  }

  public dislike(uid: string, userId: string): void {
    const query = {
      _id: uid,
    };

    const data = {
      $pull: {
        'reactions.like': userId,
      },
    };

    this.update(query, data);
  }

  public updateProfile(uid: string, data: UpdateUserData): void {
    const query = {
      _id: uid,
    };

    const updateData = {
      $set: {
        name: data.name,
        website: data.website,
        about: data.about,
      },
    };

    this.update(query, updateData);
  }
}

export default new Users();
