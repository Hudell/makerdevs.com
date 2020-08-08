import { MongoDocument } from './MongoDocument';

export type Plugin = MongoDocument & {
  importedId?: string;
  name: string;
  description: string;
  platforms: Array<string>;

};