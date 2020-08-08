import Platforms from '../models/Platforms';
// import Plugins from '../models/Plugins';
// import { oldPlugins } from '../data/plugins';

Meteor.startup(() => {
  // Create the default platforms 
  Platforms.ensurePlatform('mv', 'RPG Maker MV');
  Platforms.ensurePlatform('mz', 'RPG Maker MZ');


// Add the old plugins
  // for (const plugin of oldPlugins) {
  //   const existingPlugin = Plugins.findOneByImportedId(plugin.id);
  //   if (existingPlugin) {
  //     continue;
  //   }

  //   Plugins.addPlugin({
  //     name: plugin.name,
  //     description: plugin.description,
  //     importedId: plugin.id,
  //     platforms: ['mv'],
  //     help: plugin.help,
  //     tags: (plugin.tags || '').split(',').map(tag => tag.trim()),
  //   });
  // }
});
