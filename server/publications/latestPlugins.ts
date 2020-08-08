import { publishComposite } from 'meteor/reywood:publish-composite';

import Plugins from '../../models/Plugins';

publishComposite('latestPlugins', {
  find() {
    return Plugins.findLatest(20);
  },
  collectionName: 'latestPlugins',
});

