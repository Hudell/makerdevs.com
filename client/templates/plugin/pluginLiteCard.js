import './pluginLiteCard.html';

Template.pluginLiteCard.helpers({
  plugin() {
    return Template.instance().data.plugin;
  },
});
