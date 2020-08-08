import Plugins from '../../models/Plugins';

Meteor.publish('plugins', () => {
  return Plugins.findAll();
});