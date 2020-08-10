import { MongoDocument } from './MongoDocument';

export type PluginReview = {
  rating: number;
  comment: string;
  userId: string;
  _createdAt?: Date;
  _updatedAt?: Date;
};

export type PluginVersion = {
  name: string;
  importedId?: string;
  downloadLink?: string | null;
  externalLink?: string | null;
  platforms: Array<string>;
  reviews: Array<PluginReview>;
  score: number;
  fileId?: string | null;
  _createdAt?: Date;
  _updatedAt?: Date;
};

export type Plugin = MongoDocument & {
  importedId?: string;
  name: string;
  description: string;
  help: string;
  tags: Array<string>;
  versions: Array<PluginVersion>;
  reactions: Record<string, Array<string>>,
  userId: string;
};

export type UploadedPlugin = {
  name: string;
  platforms: Array<string>;
  description: string;
  public: boolean;
  versionName: string;
  externalLink: string;
  help: string;
  fileHeader: Record<string, any>;
  fileData: string;
}