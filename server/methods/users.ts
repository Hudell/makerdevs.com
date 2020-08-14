import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import PHPPassword from 'node-php-password';

import Users from '../../models/Users';
import Plugins from '../../models/Plugins';
import { UpdateUserData } from '../../lib/types/User';

import createDOMPurify from 'dompurify';
import { JSDOM } from "jsdom";

const DOMPurify = createDOMPurify(new JSDOM('').window as any);

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
  'user/details'(userId: string) {
    check(userId, String);

    const user = Users.findOneByIdOrSlug(userId);
    if (!user) {
      throw new Meteor.Error('user-not-found');
    }

    const sameUser = user._id === Meteor.userId();

    if (user) {
      user.plugins = [];

      const plugins = Plugins.findAllByUser(user._id as string, sameUser);
      if (plugins) {
        plugins.forEach((plugin) => {
          user.plugins.push(plugin);
        });
      }
    }

    return user;
  },
  'user/like'(uid: string) {
    check(uid, String);

    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    const user = Users.findOneByIdOrSlug(uid);
    if (!user) {
      throw new Meteor.Error('user-not-found');
    }

    if (user.reactions?.like?.includes(userId)) {
      Users.dislike(user._id as string, userId);
    } else {
      Users.like(user._id as string, userId);
    }
  },
  'user/edit'(userData: UpdateUserData) {
    check(userData, {
      _id: String,
      name: String,
      website: String,
      about: String,
    });

    const userId = Meteor.userId();
    if (!userId || userId !== userData._id) {
      throw new Meteor.Error('not-authorized');
    }

    if (!userData.name || userData.name.length > 60) {
      throw new Meteor.Error('invalid-data');
    }
    if (userData.website && userData.website.length > 255) {
      throw new Meteor.Error('invalid-data');
    }

    let about = userData.about;
    if (about) {
      about = DOMPurify.sanitize(about, { ALLOWED_TAGS: [] })
    }

    Users.updateProfile(userData._id, {
      name: userData.name,
      website: userData.website,
      about: about,
    });
  }
});
