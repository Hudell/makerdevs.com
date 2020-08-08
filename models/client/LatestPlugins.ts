import { Meteor } from 'meteor/meteor';

import { Base } from '../Base';
import { MongoDocument } from '../../lib/types/MongoDocument';
import { Plugin } from '../../lib/types/Plugin';

class LatestPluginsModel extends Base {
  constructor() {
    super('latestPlugins');
  }
}

export default new LatestPluginsModel();
