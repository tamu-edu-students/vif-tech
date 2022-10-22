const report = require("multiple-cucumber-html-reporter");

report.generate({
  jsonDir: "cypress/cucumber-json",
  reportPath: "./reports/cypress-cucumber-html-report",
  metadata: {
    browser: {
      name: "chrome"
    },
    platform: {
      name: "windows",
      version: "10"
    }
  }
})
