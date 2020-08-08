import LatestPlugins from '../../../models/client/LatestPlugins';

import './latestPlugins.html';
import '../plugin/pluginCard';

Template.latestPlugins.helpers({
  plugins() {
    return LatestPlugins.findAll();
  },
});
