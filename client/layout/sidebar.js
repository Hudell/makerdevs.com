import { Session } from 'meteor/session';

import gravatar from 'gravatar';

import './sidebar.html';

Template.sidebar.helpers({
  avatarUrl() {
    const user = Meteor.user();
    let email;

    if (user.emails && user.emails[0] && user.emails[0].address) {
      email = user.emails[0].address;
    }

    return gravatar.url(email, {}, true);
  }
});