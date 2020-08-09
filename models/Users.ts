import { Meteor } from 'meteor/meteor';

import { Base } from './Base';

class Users extends Base {
  constructor() {
    super('users', Meteor.users as any);
  }
}

export default new Users();
