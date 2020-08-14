import { FlowRouter } from 'meteor/kadira:flow-router';
import toastr from 'toastr';

import { Modal } from '../../utils/modal';
import './pluginFile.html';
import { Platforms } from '../../../data/Platforms';

const getPlugin = () => {
  return Template.instance().data.plugin;
};

Template.pluginFile.helpers({
  file() {
    return Template.instance().data.file;
  },
  platformName(code) {
    if (code in Platforms) {
      return Platforms[code].name;
    }

    return code.toUpperCase();
  },
  platformIcon(code) {
    if (code in Platforms) {
      return Platforms[code].icon;
    }

    return `/icons/platforms/${code}.png`;
  },
  canDelete() {
    const plugin = getPlugin();
    return plugin.userId === Meteor.userId();
  },
});

Template.pluginFile.events({
  'click .delete-file-btn'(e, instance) {
    e.preventDefault();

    const file = instance.data.file;

    Modal.show('Do you want to delete this version?', `Click Confirm to permanently delete the "${ file.name }" version.`, () => {
      const pluginId = FlowRouter.getParam('pluginId');
      const fileId = e.target.dataset.id;

      Meteor.call('plugin/file/delete', pluginId, fileId, (err, result) => {
        if (err) {
          console.log(err);
          toastr.error("Failed to delete the version. Try again.");
          return;
        }

        toastr.success("Version deleted successfully.");
        document.location.reload(false);
      });
    });
  }
})
