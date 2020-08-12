import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import toastr from 'toastr';

import './resetPassword.html';

Template.resetPassword.events({
  'submit form'(e) {
    e.preventDefault();

    const input = $('#userEmail');
    const email = input.val();

    if (!email) {
      toastr.error("Email is required");
      return;
    }

    input.prop('disabled', true);
    Accounts.forgotPassword({ email }, (error) => {
      input.prop('disabled', false);
      if (error) {
        Meteor.call('users/sendFakePasswordRecovery', email);
      }
      toastr.info(`An email was sent to ${email}, please check your inbox.`);
    })
  }
});
