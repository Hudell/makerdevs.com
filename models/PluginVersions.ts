import { Meteor } from 'meteor/meteor';

import { Base } from './Base';

class PluginVersionsModel extends Base {
  constructor() {
    super('plugin_versions');
  }
}

export default new PluginVersionsModel();
