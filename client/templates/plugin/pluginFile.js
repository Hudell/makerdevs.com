import { FlowRouter } from 'meteor/kadira:flow-router';
import toastr from 'toastr';

import { Modal } from '../../utils/modal';
import './pluginFile.html';

const getPlugin = () => {
  return Template.instance().data.plugin;
};

Template.pluginFile.helpers({
  file() {
    return Template.instance().data.file;
  },
  platformName(code) {
    const plugin = getPlugin();

    for (const platform of plugin.platforms) {
      if (platform._id == code) {
        return platform.name;
      }
    }

    return code.toUpperCase();
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
        // FlowRouter.go(`/plugin/${ pluginId }`);
      });
    });
  }
})
