import { FlowRouter } from 'meteor/kadira:flow-router';

import './results.html';
import '../plugin/pluginLiteCard';
import Plugins from '../../../models/Plugins';

Template.searchResults.helpers({
  plugins() {
    return Template.instance().plugins.get();
  },
  isLoaded() {
    return Template.instance().isLoaded.get();
  },

  resultCount() {
    const plugins = Template.instance().plugins.get();
    if (!plugins) {
      return 0;
    }

    return plugins.length;
  },

  singleResult() {
    const plugins = Template.instance().plugins.get();
    if (!plugins) {
      return 0;
    }

    return plugins.length === 1;
  },
});

Template.searchResults.onCreated(function(){
  this.plugins = new ReactiveVar(false);
  this.isLoaded = new ReactiveVar(false);

  const query = FlowRouter.getParam('query');

  Meteor.call('plugin/search', query, (err, result) => {
    if (err) {
      console.log(err);
      toastr.error("Failed to load plugins.");
      return;
    }

    this.isLoaded.set(true);
    this.plugins.set(result);
  });

});