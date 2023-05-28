const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout:20000,

  e2e: {
    baseUrl: 'https://demo.evershop.io',
    experimentalOriginDependencies: true,
    

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
