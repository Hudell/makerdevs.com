import { MongoDocument } from './MongoDocument';

export type User = MongoDocument & {
  name: string;
  emails: Array<{
    address: string;
    verified: boolean;
  }>;
  services: Record<string, any>;
  website?: string;
  views?: number;
  about?: string;
  importedId?: string;
};

export type UpdateUserData = MongoDocument & {
  name: string;
  website?: string;
  about?: string;
};