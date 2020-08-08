import { Meteor } from 'meteor/meteor';

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

  public findAllByPlatform(platformCode: string, { sort }: { sort?: Record<string, number>} = {}): Mongo.Cursor<MongoDocument> {
    const options = {
      sort,
    };

    return this.find({
      platforms: platformCode,
    }, options);
  }

  public findAllByPlatformAndSymbol(platformCode: string, symbol: string): Mongo.Cursor<MongoDocument> {
    const options = {
      sort: {
        name: -1,
      },
    };

    if (!symbol) {
      return this.findAllByPlatform(platformCode, options);
    }

    const rgx = new RegExp(symbol === '#' ? '^[^a-zA-Z]' : `^${ symbol }`, 'i');
    return this.find({
      platforms: platformCode,
      name: rgx,
    }, options);
  }

  public hasAnyPluginWithSymbolOnPlatform(symbol: string, platformCode: string): boolean {
    const rgx = new RegExp(symbol === '#' ? '^[^a-zA-Z]' : `^${ symbol }`, 'i');
    return this.find({
      platforms: platformCode,
      name: rgx,
    }).count() > 0;
  }
}

export default new PluginsModel();
