import { FlowRouter } from 'meteor/kadira:flow-router';

import './results.html';
import '../plugin/pluginLiteCard';
import Plugins from '../../../models/Plugins';

Template.searchResults.helpers({
  plugins() {
    return Plugins.findAll({
      sort: {
        score: -1,
      },
    });
  },

  resultCount() {
    return Plugins.findAll().count();
  },
});
