import { Base } from './Base';
import { MongoDocument } from '../lib/types/MongoDocument';
import { Plugin } from '../lib/types/Plugin';

class PluginsModel extends Base {
  constructor() {
    super('plugins');
  }

  public findOneByImportedId(importedId: string): Plugin | undefined {
    const plugin = this.findOne({
      importedId,
    });

    if (plugin) {
      return plugin as Plugin;
    }
  }

  public addPlugin(record: Plugin): string {
    return this.insert(record);
  }

  public findPlatformMasterlist(platformCode: string): Mongo.Cursor<MongoDocument> {
    const options = {
      sort: {
        name: 1,
      },
      fields: {
        _id: 1,
        name: 1,
        description: 1,
      },
    };

    const query = {
      'versions.platforms': platformCode,
    };

    return this.find(query, options);
  }
}

export default new PluginsModel();
