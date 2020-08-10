import { Base } from './Base';

class FilesModel extends Base {
  constructor() {
    super('files');
  }

  public insertFile(name: string, size: number, type: string, data: string) {
    return this.insert({
      name,
      size,
      type,
      data,
    });
  }
}

export default new FilesModel();
