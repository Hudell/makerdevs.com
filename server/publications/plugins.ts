import { publishComposite } from 'meteor/reywood:publish-composite';

import Plugins from '../../models/Plugins';

Meteor.publish('plugins', () => {
  return Plugins.findAll();
});

publishComposite('mv:masterlist', {
  find() {
    return Plugins.findPlatformMasterlist('mv');
  },
  collectionName: 'mv:masterlist',
});

publishComposite('mz:masterlist', {
  find() {
    return Plugins.findPlatformMasterlist('mz');
  },
  collectionName: 'mz:masterlist',
});

publishComposite('latestPlugins', {
  find() {
    return Plugins.findLatest(20);
  },
  collectionName: 'latestPlugins',
});
