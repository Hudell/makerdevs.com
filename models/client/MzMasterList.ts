import { MasterListModel } from './BaseMasterList';

class MzMasterListModel extends MasterListModel {
  constructor() {
    super('mz:masterlist');
  }
}

export default new MzMasterListModel();
