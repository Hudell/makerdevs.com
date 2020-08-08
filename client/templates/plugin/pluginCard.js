import './pluginCard.html';

Template.pluginCard.helpers({
  displayName() {
    const name = this.name;
    return name;
  }
});
