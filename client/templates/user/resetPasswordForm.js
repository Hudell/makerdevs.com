import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from "meteor/session";
import { Accounts } from "meteor/accounts-base";
import toastr from 'toastr';

import "./resetPasswordForm.html";

Template.resetPasswordForm.events({
  'submit form'(e) {
    e.preventDefault();
    const password = $('#resetPassword').val();
    const confirmation = $('#resetPasswordConfirmation').val();
    if (password !== confirmation) {
      toastr.error("Confirmation does not match the current password");
      return;
    }
    Accounts.resetPassword(Session.get('resetPasswordToken'), password, (error) => {
      if (error) {
        toastr.error("Couldn't reset account password.");
        return;
      }
      toastr.info("Your password has been reset successfully.");
      FlowRouter.go('/home');
    });
  }
});
