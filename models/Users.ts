import { Meteor } from 'meteor/meteor';

import { User } from '../lib/types/User';
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
}

export default new Users();
