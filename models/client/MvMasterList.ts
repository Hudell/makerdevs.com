import { MasterListModel } from './BaseMasterList';

class MvMasterListModel extends MasterListModel {
  constructor() {
    super('mv:masterlist');
  }
}

export default new MvMasterListModel();
