import { Meteor } from 'meteor/meteor';
import { Blaze } from "meteor/blaze";
import { Email } from 'meteor/email';
import { check } from 'meteor/check';

import PHPPassword from 'node-php-password';

import Users from '../../models/Users';
import { NO_REPLY_EMAIL } from '../constants';

Meteor.methods({
  'user/register'(name, email, password) {
    check(name, String);
    check(email, String);
    check(password, String);

    if (!name || !email || !password) {
      throw new Meteor.Error('invalid-data');
    }

    const userId = Accounts.createUser({
      email,
      password
    });

    const user = Users.findOneById(userId);
    if (!user) {
      throw new Meteor.Error('failed-to-create-user');
    }

    Users.setName(userId, name);
    return user;
  },

  'user/convertPassword'(email, oldSitePassword, password) {
    check(email, String);
    check(oldSitePassword, String);
    check(password, String);

    if (!email || !oldSitePassword || !password) {
      throw new Meteor.Error('invalid-data');
    }

    const user = Users.findOneByEmail(email);
    if (!user) {
      throw new Meteor.Error('user-not-found');
    }

    const oldPassword = user.services?.mvplugins?.password;
    if (!oldPassword) {
      throw new Meteor.Error('missing-data');
    }

    if (!PHPPassword.verify(oldSitePassword, oldPassword)) {
      throw new Meteor.Error("Passwords don't match.");
    }

    Accounts.setPassword(user._id as string, password);
  },
  'users/resetPassword'(email) {
    const user = Users.findOneByEmail(email);
    this.unblock();
    if (!user) {
      const html = Blaze.toHTMLWithData(Template.passwordRecoveryNotFound, { email });
      Email.send({ from: NO_REPLY_EMAIL, to: email, html });
      return;
    }
    Accounts.sendResetPasswordEmail(user.id, email);
  }
});
