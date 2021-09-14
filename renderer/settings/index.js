const toggleSettingsWindow = (window) => {
  if (!window.isVisible()) {
    initSettings(window);
    window.show();
  } else {
    removeSettings(window);
    window.hide();
  }
};

const initSettings = () => {};

const removeSettings = () => {};

module.exports = { toggleSettingsWindow };
