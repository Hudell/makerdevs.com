export type MongoDocument = Record<string, any> & {
  _id?: string;

  _createdAt?: Date;
  _updatedAt?: Date;
};
