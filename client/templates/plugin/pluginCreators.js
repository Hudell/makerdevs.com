import toastr from 'toastr';

import '../plugin/creatorCard';
import './pluginCreators.html';

Template.pluginCreators.helpers({
  creators() {
    return Template.instance().creators.get();
  },
  isLoaded() {
    return Template.instance().isLoaded.get();
  },
});

Template.pluginCreators.onCreated(function(){
  this.creators = new ReactiveVar(false);
  this.isLoaded = new ReactiveVar(false);

  Meteor.call('plugin/creators', (err, result) => {
    if (err) {
      console.log(err);
      toastr.error("Failed to load creators.");
      return;
    }

    this.isLoaded.set(true);
    this.creators.set(result);
  });

});