import './pluginCard.html';

const PLATFORM_NAMES = {
  mv: 'RPG Maker MV',
  mz: 'RPG Maker MZ'
};

Template.pluginCard.helpers({
  displayName() {
    const name = this.name;
    return name;
  },
  icons() {
    const lastVersion = this.versions[this.versions.length - 1];
    return lastVersion.platforms.map(i => ({
      name: PLATFORM_NAMES[i] || 'Unknown Platform',
      src: `/icons/platforms/${i}.png`
    }));
  }
});
