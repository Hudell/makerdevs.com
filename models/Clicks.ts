import { Base } from './Base';

class ClicksModel extends Base {
  constructor() {
    super('clicks');

    this.ensureIndex('pluginId');
  }

  public insertClick(pluginId: string, userId?: string | null, address?: string | null) {
    return this.insert({
      pluginId,
      userId: userId || undefined,
      address: address || undefined
    });
  }
}

export default new ClicksModel();
