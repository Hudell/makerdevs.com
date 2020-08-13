import { refreshLoginServices } from './functions/refreshLoginServices';
import { Accounts } from 'meteor/accounts-base';

// import './importOldData';

Meteor.startup(() => {
  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
  };

  Accounts.emailTemplates.siteName = 'MakerDevs.com';
  Accounts.emailTemplates.from = process.env['NO_REPLY_EMAIL'] || 'No reply @ Makerdevs <no-reply@makerdevs.com>';

  // Sync all login services:
  refreshLoginServices();
});
