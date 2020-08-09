import Platforms from '../models/Platforms';

// import './importOldData';

Meteor.startup(() => {
  // Create the default platforms 
  Platforms.ensurePlatform('mv', 'RPG Maker MV');
  Platforms.ensurePlatform('mz', 'RPG Maker MZ');
});
