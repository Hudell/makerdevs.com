import './submitPlugin.html';

Template.submitPlugin.helpers({

});

Template.submitPlugin.events({
  'click .submit'(e, instance) {
    e.preventDefault();

    const mv = $('#platform_mv').is(':checked');
    const mz = $('#platform_mz').is(':checked');

    const name = $('#pluginName').val();
    const description = $('#pluginDescription').val();

    const public = $('#pluginPublic').is(':checked');
    const versionName = $('#pluginVersion').val();
    const externalLink = $('#pluginLink').val();

    console.log({
      mv,
      mz,
      name,
      description,
      public,
    })



  },
});