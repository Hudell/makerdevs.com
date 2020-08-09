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
}

export default new Users();
