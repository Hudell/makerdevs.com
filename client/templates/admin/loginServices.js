import './loginServices.html';
import toastr from 'toastr';

Template.loginServices.helpers({
  services() {
    return Template.instance().services.get();
  },
  isLoaded() {
    return Template.instance().isLoaded.get();
  },
});

Template.loginServices.events({
  'submit form'(e, instance) {
    e.preventDefault();

    if (!e.target?.elements?.serviceName) {
      return;
    }

    const id = e.target.id?.value;
    const name = e.target.serviceName.value;
    const clientId = e.target.clientId.value;
    const secret = e.target.secret.value;
    const loginStyle = e.target.loginStyle.value;
    const buttonIcon = e.target.buttonIcon.value;
    const buttonText = e.target.buttonText.value;
    const enabled = e.target.enabled.checked;

    if (!name) {
      toastr.error('Inform the service name');
      return;
    }

    const data = {
      name,
      clientId,
      secret,
      loginStyle,
      buttonIcon,
      buttonText,
      enabled,
    };

    if (!id) {
      Meteor.call('services/add', data, (err, result) => {
        if (err) {
          console.log(err);
          toastr.error('Failed to add service');
          return;
        }

        toastr.success('Service added successfully.');
        FlowRouter.go('/home');
      });
    } else {
      Meteor.call('services/update', id, data, (err, result) => {
        if (err) {
          console.log(err);
          toastr.error('Failed to edit service');
          return;
        }

        toastr.success('Service edited successfully.');
        FlowRouter.go('/home');
      });
    }
  },
  'click .btn-delete'(e, instance) {
    e.preventDefault();
    if (!e.target.dataset.id) {
      return;
    }

    Meteor.call('services/delete', e.target.dataset.id, (err) => {
      if (err) {
        console.log(err);
        toastr.error('Failed to delete login service.');
        return;
      }

      toastr.success("Service deleted successfully");
      return FlowRouter.go('/home');
    });
  }
});

Template.loginServices.onCreated(function() {
  this.services = new ReactiveVar(false);
  this.isLoaded = new ReactiveVar(false);

  const user = Meteor.user();
  if (!user || !user.admin) {
    return FlowRouter.go('/home');
  }

  Meteor.call('services/get', (err, data) => {
    if (err) {
      if (err.message === 'not-authorized'){
        return FlowRouter.go('/home');
      }

      console.log(err);
      return;
    }

    this.services.set(data);
    this.isLoaded.set(true);
  });
});