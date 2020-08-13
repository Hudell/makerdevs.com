import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';
import gravatar from 'gravatar';

import './mainHeader.html';

Template.mainHeader.events({
  'submit #searchForm'(e, instance) {
    e.preventDefault();
    const query = $('#siteSearch').val();

    FlowRouter.go(`/search/${ query }`);
  }
});

Template.mainHeader.helpers({
  avatarUrl() {
    const user = Meteor.user();
    let email;

    if (user.emails && user.emails[0] && user.emails[0].address) {
      email = user.emails[0].address;
    }

    return gravatar.url(email, {}, true);
  }
});