import { MongoDocument } from './MongoDocument';

export type Service = MongoDocument & {
  name: String;
  clientId: String;
  secret: String;
  loginStyle: String;
  buttonIcon: String;
  buttonText: String;
  enabled: Boolean;
};