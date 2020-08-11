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

  public userLikedPlugin(userId: string, pluginId: string): boolean {
    const query = {
      _id: pluginId,
      'reactions.like': userId,
    };

    return this.find(query, {}).count() > 0;
  }

  public like(pluginId: string, userId: string): void {
    const query = {
      _id: pluginId,
    };

    const data = {
      $addToSet: {
        'reactions.like': userId,
      },
    };

    this.update(query, data);
  }

  public dislike(pluginId: string, userId: string): void {
    const query = {
      _id: pluginId,
    };

    const data = {
      $pull: {
        'reactions.like': userId,
      },
    };

    this.update(query, data);
  }
}

export default new PluginsModel();
