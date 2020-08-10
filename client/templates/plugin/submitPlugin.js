import './submitPlugin.html';
import toastr from 'toastr';


Template.submitPlugin.helpers({
  fileHeader() {
    return Template.instance().fileHeader.get();
  },
  isFileLoading() {
    const data = Template.instance().fileData.get();
    return !data;
  },
});

Template.submitPlugin.events({
  'change #pluginFile'(e, instance) {
    const file = e.currentTarget.files[0];
    if (!file) {
      toastr.error("Failed to read file data.");
      return;
    }

    const { type, size, name } = file;

    if (size > 1024 * 1024) {
      toastr.error("The maximum file size is 1MB.");
      return;
    }

    const allowedTypes = ['application/x-7z-compressed', 'application/zip', 'application/x-rar-compressed', 'text/javascript'];
    if (!allowedTypes.includes(type)) {
      toastr.error('Invalid file type');
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

  'click .submit'(e, instance) {
    e.preventDefault();

    const mv = $('#platform_mv').is(':checked');
    const mz = $('#platform_mz').is(':checked');

    const name = $('#pluginName').val();
    const description = $('#pluginDescription').val();

    const public = $('#pluginPublic').is(':checked');
    const versionName = $('#pluginVersion').val();
    const externalLink = $('#pluginLink').val();
    const help = $('#pluginHelp').val();

    const fileHeader = instance.fileHeader.get();
    const fileData = instance.fileData.get();

    const pluginData = {
      platforms: [],
      name,
      description,
      public,
      versionName,
      externalLink,
      fileHeader: (fileHeader ? {
        name: fileHeader.name,
        size: fileHeader.size,
        type: fileHeader.type,
      } : undefined),
      fileData,
      help,
    };

    if (mv) {
      pluginData.platforms.push('mv');
    }
    if (mz) {
      pluginData.platforms.push('mz');
    }

    let valid = true;
    if (!name) {
      toastr.error("The name field is required.");
      valid = false;
    } else if (name.trim().length > 60) {
      toastr.error("The plugin name is too large.");
      valid = false;
    }

    if (description && description.trim().length > 255) {
      toastr.error("The plugin summary is too large.");
      valid = false;
    }

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

    Meteor.call('plugin/submit', pluginData, (err, result) => {
      if (err) {
        console.log(err);
        toastr.error("Failed to save the data, review the data and try again.");
        return;
      }

      toastr.success("Plugin submmited successfully.");

      if (result) {
        FlowRouter.go(`/plugin/${ result }`);
      } else {
        FlowRouter.go('/home');
      }
    });
  },
});

Template.submitPlugin.onCreated(function() {
  this.fileHeader = new ReactiveVar(null);
  this.fileData = new ReactiveVar(null);
});