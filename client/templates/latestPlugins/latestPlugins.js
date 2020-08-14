import toastr from 'toastr';

import './latestPlugins.html';
import '../plugin/pluginCard';

Template.latestPlugins.helpers({
  plugins() {
    return Template.instance().plugins.get();
  },
  isLoaded() {
    return Template.instance().isLoaded.get();
  },
});

Template.latestPlugins.onCreated(function(){
  this.plugins = new ReactiveVar(false);
  this.isLoaded = new ReactiveVar(false);

  Meteor.call('plugin/latest', (err, result) => {
    if (err) {
      console.log(err);
      toastr.error("Failed to load plugins.");
      return;
    }

    this.isLoaded.set(true);
    this.plugins.set(result);
  });

});