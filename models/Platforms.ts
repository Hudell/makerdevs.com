import { Base } from './Base';

class PlatformsModel extends Base {
  constructor() {
    super('platforms');
  }

  public ensurePlatform(code: string, name: string): void {
    this.upsert({
      _id: code,
    }, {
      _id: code,
      name,
    });
  }
}

export default new PlatformsModel();
