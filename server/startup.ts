import Platforms from '../models/Platforms';
import { refreshLoginServices } from './functions/refreshLoginServices';
import { Accounts } from 'meteor/accounts-base';

// import './importOldData';

Meteor.startup(() => {
  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
  };
  // Create the default platforms
  Platforms.ensurePlatform('mv', 'RPG Maker MV');
  Platforms.ensurePlatform('mz', 'RPG Maker MZ');

  // Sync all login services:
  refreshLoginServices();
});
