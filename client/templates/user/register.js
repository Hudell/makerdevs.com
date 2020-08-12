import { FlowRouter } from 'meteor/kadira:flow-router';
import toastr from 'toastr';
import SHA256 from 'meteor-sha256';

import Services from '../../../models/Services';
import './register.html';

Template.register.helpers({
  services() {
    return Services.findAll();
  },
  hasAnyService() {
    return Services.findAll().count() > 0;
  },
});

Template.register.events({
  'submit form'(e, instance) {
    e.preventDefault();

    const username = $('#registerName').val();
    const email = $('#registerEmail').val();
    const password = $('#registerPassword').val();
    const passwordConfirmation = $('#registerPasswordConfirmation').val();

    if (!username) {
      toastr.error("Username is required");
      return;
    }

    if (!email) {
      toastr.error("Email is required");
      return;
    }

    if (!password) {
      toastr.error("Input your password.");
      return;
    }

    if (!passwordConfirmation) {
      toastr.error("Input your password confirmation.");
      return;
    }

    if (password !== passwordConfirmation) {
      toastr.error("Passwords don't match.");
      return;
    }

    const hashedPassword = SHA256(password);

    Meteor.call('user/register', username, email, hashedPassword, (err, result) => {
      if (err) {
        if (err.reason == "Username already exists.") {
          toastr.error("An user with that name already exists.");
          return;
        }

        if (err.reason == "Email already exists.") {
          toastr.error("That email is already registered.");
          return;
        }

        console.log(err);
        toastr.error("Failed to create user");
        return;
      }

      toastr.success("User created successfully");
      Meteor.loginWithPassword({ email }, hashedPassword, (err, result) => {
        if (err) {
          toastr.error("Failed to login automatically.");
          console.log(err);
          FlowRouter.go('/login');
        } else {
          FlowRouter.go('/me');
        }
      })
    });
  },

  'click .btn-github'(e, instance) {
    e.preventDefault();

    Meteor.loginWithGithub((err) => {
      if (err) {
        console.log(err);
        toastr.error("Login failed");
        return;
      }

      FlowRouter.go('/me');
    });
  }

});