import { _ } from 'meteor/underscore';
import toastr from 'toastr';

import { validateFile } from '../../../lib/fileTypes';
import './sendFile.html';

Template.sendFile.helpers({
  fileHeader() {
    return Template.instance().fileHeader.get();
  },
  isFileLoading() {
    const data = Template.instance().fileData.get();
    return !data;
  },
});

Template.sendFile.events({
  'change #pluginFile'(e, instance) {
    const file = e.currentTarget.files[0];
    if (!file) {
      toastr.error("Failed to read file data.");
      return;
    }

    try {
      validateFile(file);
    } catch(e) {
      toastr.error(e.message);
      $('#pluginFile').val('');
      return;
    }

    instance.fileHeader.set(file);
    instance.fileData.set(null);
    const reader = new FileReader();
    reader.onload = function(fileLoadEvent) {
      instance.fileData.set(reader.result);
      $('#pluginFile').val('');
    };

    reader.readAsBinaryString(file);
  },

  'click #removeFile'(e, instance) {
    // Give the animation some time before changing the reactive vars
    setTimeout(() => {
      instance.fileHeader.set(null);
      instance.fileData.set(null);
      $('#pluginFile').val('');
    }, 400);
  },

  'click .cancel'(e, instance) {
    e.preventDefault();
    const pluginId = FlowRouter.getParam('pluginId');
    FlowRouter.go(`/plugin/${ pluginId }`);
  },

  'click .submit'(e, instance) {
    e.preventDefault();

    const pluginId = FlowRouter.getParam('pluginId');
    const mv = $('#platform_mv').is(':checked');
    const mz = $('#platform_mz').is(':checked');

    const public = $('#pluginPublic').is(':checked');
    const versionName = $('#pluginVersion').val();
    const externalLink = $('#pluginLink').val() || undefined;

    const fileHeader = instance.fileHeader.get() || undefined;
    const fileData = instance.fileData.get() || undefined;

    const pluginData = {
      platforms: [],
      versionName,
      externalLink,
      fileHeader: (fileHeader ? {
        name: fileHeader.name,
        size: fileHeader.size,
        type: fileHeader.type,
      } : undefined),
      fileData,
    };

    if (mv) {
      pluginData.platforms.push('mv');
    }
    if (mz) {
      pluginData.platforms.push('mz');
    }

    let valid = true;
    if (!versionName) {
      toastr.error("The version name is required.");
      valid = false;
    } else if (!versionName.trim().length > 40) {
      toastr.error("The version name is too large.");
      valid = false;
    }

    if (!mv && !mz) {
      toastr.error("You need to select a platform.");
      valid = false;
    }

    if (!externalLink && !fileData) {
      toastr.error("You need to inform an external link or upload a file.");
      valid = false;
    }

    if (!valid) {
      return;
    }

    Meteor.call('plugin/submitFile', pluginId, pluginData, (err, result) => {
      if (err) {
        console.log(err);
        toastr.error("Failed to save the file, review the data and try again.");
        return;
      }

      toastr.success("Plugin file submmited successfully.");
      FlowRouter.go(`/plugin/${ pluginId }`);
    });
  },
});

Template.sendFile.onCreated(function() {
  this.fileHeader = new ReactiveVar(null);
  this.fileData = new ReactiveVar(null);
});