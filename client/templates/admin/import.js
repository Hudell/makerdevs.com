import './import.html';
import toastr from 'toastr';

Template.import.events({
  'click .import'(e, instance) {
    Meteor.call('data/import', (err) => {
      if (err) {
        toastr.error("Failed");
        console.log(err);
        return;
      }

      toastr.success("Importing");
    });
  }
})