import { Base } from '../Base';
import { MongoDocument } from '../../lib/types/MongoDocument';

export class MasterListModel extends Base {
  constructor(name: string) {
    super(name);
  }

  public hasAnyPluginWithSymbol(symbol: string): boolean {
    const rgx = new RegExp(symbol === '#' ? '^[^a-zA-Z]' : `^${ symbol }`, 'i');
    return this.find({
      name: rgx,
    }).count() > 0;
  }

  public findAllBySymbol(symbol: string): Mongo.Cursor<MongoDocument> {
    const options = {
      sort: {
        name: -1,
      },
    };

    if (!symbol) {
      return this.findAll(options);
    }

    const rgx = new RegExp(symbol === '#' ? '^[^a-zA-Z]' : `^${ symbol }`, 'i');
    return this.find({
      name: rgx,
    }, options);
  }
}
