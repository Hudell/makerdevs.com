import './changePassword.html';

import { _ } from 'meteor/underscore';
import toastr from 'toastr';
import { Session } from 'meteor/session';
import SHA256 from 'meteor-sha256';

const getUser = () => {
  return Template.instance().user.get();
};

const refreshData = (instance) => {
  const userId = FlowRouter.getParam('userId');

  Meteor.call('user/details', userId, (err, data) => {
    instance.isLoaded.set(true);

    if (err) {
      toastr.error("Failed to load user data.");
      console.log(err);
      return;
    }

    if (data._id !== Meteor.userId()) {
      toastr.error("You can't edit someone else's password.");
      FlowRouter.go(`/profile/${ data.slug || data._id }`);
      return;
    }

    Session.set('pageTitle', `Change Password - ${ data.name }`);
    instance.user.set(data);
  });
};

Template.changePassword.helpers({
  isLoaded() {
    return Template.instance().isLoaded.get();
  },
  user() {
    return getUser();
  }
});

Template.changePassword.events({
  'click .cancel'(e, instance) {
    const userId = FlowRouter.getParam('userId');
    FlowRouter.go(`/profile/${ userId }`);
  },

  'click .submit'(e, instance) {
    e.preventDefault();

    const user = getUser();
    const userId = user._id;
    const oldPassword = $('#oldPassword').val();
    const newPassword = $('#newPassword').val();
    const newPasswordConfirmation = $('#newPasswordConfirmation').val();

    if (!oldPassword) {
      toastr.error("Input your old password.");
      return;
    }

    if (!newPassword) {
      toastr.error("Input your new password.");
      return;
    }

    if (!newPasswordConfirmation) {
      toastr.error("Input your password confirmation.");
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      toastr.error("Passwords don't match.");
      return;
    }

    const hashedOldPassword = SHA256(oldPassword);
    const hashedNewPassword = SHA256(newPassword);

    Accounts.changePassword(hashedOldPassword, hashedNewPassword, (err, result) => {
      if (err) {
        if (err.reason === 'Incorrect password') {
          toastr.error("The old password is wrong.");
          return;
        }

        console.log(err);
        toastr.error("Failed to save the new password.");
        return;
      }

      toastr.success("Password updated successfully.");
      FlowRouter.go(`/profile/${ user.slug || user._id }`);
    });
  },
});

Template.changePassword.onCreated(function() {
  this.user = new ReactiveVar(false);
  this.isLoaded = new ReactiveVar(false);

  if (!Meteor.userId()) {
    const userId = FlowRouter.getParam('userId');
    toastr.error("You need to be logged in to edit your password.");
    FlowRouter.go(`/profile/${ userId }`);
    return;
  }

  refreshData(this);
});