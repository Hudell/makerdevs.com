import { Mongo } from 'meteor/mongo';

import { MongoDocument } from '../lib/types/MongoDocument';

export class Base {
  protected _db: Mongo.Collection<MongoDocument>;
  protected _name: string;

  constructor(name: string, db: Mongo.Collection<MongoDocument> | undefined = undefined) {
    this._db = db || new Mongo.Collection(name);
    this._name = name;
  }

  protected ensureIndex(keys: { [key: string]: number | string } | string, options?: { [key: string]: any }): void {
    if (Meteor.isServer) {
      this._db._ensureIndex(keys, options);
    }
  }

  protected find(query = {}, options = {}): Mongo.Cursor<MongoDocument> {
    return this._db.find(query, options);
  }

  protected findById(_id: string, options = {}): Mongo.Cursor<MongoDocument> {
    return this.find({ _id }, options);
  }

  protected findOne(query = {}, options = {}): MongoDocument | undefined {
    return this._db.findOne(query, options);
  }

  protected setUpdatedAt(record: Record<string, any> = {}) {
    if (/(^|,)\$/.test(Object.keys(record).join(','))) {
      record.$set = record.$set || {};
      record.$set._updatedAt = new Date();
    } else {
      record._updatedAt = new Date();
    }

    return record;
  }

  protected insert(record: Record<string, any>): string {
    if (!record._createdAt) {
      record._createdAt = new Date();
    }

    if (!record._updatedAt) {
      record._updatedAt = new Date();
    }
    const result = this._db.insert(record);
    record._id = result;
    return result;
  }

  protected update(query: Record<string, any>, update: Record<string, any>, options: Record<string, any> = {}): void {
    this.setUpdatedAt(update);

    this._db.update(query, update, options);
  }

  protected upsert(query: Record<string, any>, update: Record<string, any>, options: Record<string, any> = {}): void {
    options.upsert = true;
    this.update(query, update, options);
  }

  protected remove(query: Record<string, any>): void {
    const records = this._db.find(query).fetch();

    const ids = [];
    for (const record of records) {
      ids.push(record._id);
    }

    query = { _id: { $in: ids } };

    this._db.remove(query);
  }

  public findOneById(_id: string): MongoDocument | undefined {
    return this.findOne({ _id }, {});
  }

  public findAll({limit = 0, sort}: { limit?: number; sort?: Record<string, number>} = {}): Mongo.Cursor<MongoDocument> {
    const options = {
      ...limit && { limit },
      sort,
    };

    return this.find({}, options);
  }

  public findLatest(limit: number): Mongo.Cursor<MongoDocument> {
    return this.findAll({
      limit,
      sort: {
        _createdAt: -1,
      },
    });
  }
}