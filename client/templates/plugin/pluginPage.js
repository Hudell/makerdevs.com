import { FlowRouter } from 'meteor/kadira:flow-router';

import Plugins from '../../../models/Plugins';
import './pluginPage.html';


Template.pluginPage.helpers({
  plugin() {
    return Template.instance().plugin;
  },
  isLoaded() {
    return Template.instance().isLoaded;
  }
});

Template.pluginPage.onCreated(() => {
  const pluginId = FlowRouter.getParam('pluginId');

  this.plugin = new ReactiveVar(false);
  this.isLoaded = new ReactiveVar(false);


  // return Plugins.findOneById(pluginId);

});
