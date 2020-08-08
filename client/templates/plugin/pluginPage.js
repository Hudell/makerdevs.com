import Plugins from '../../../models/Plugins';
import './pluginPage.html';


Template.pluginPage.helpers({
  name() {
    return 'PluginName';
  },
  description() {
    return 'description';
  },
});
