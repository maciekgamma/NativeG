const loadConfigFile = require("rollup/dist/loadConfigFile");
const path = require("path");
const rollup = require("rollup");
const log = require("npmlog");
const { exec } = require("child_process");

// load the config file next to the current script;
// the provided config object has the same effect as passing "--format es"
// on the command line and will override the format of all outputs
loadConfigFile(path.resolve(__dirname, "../rollup.config.js"), {
  format: "es",
}).then(async ({ options, warnings }) => {
  // "warnings" wraps the default `onwarn` handler passed by the CLI.
  // This prints all warnings up to this point:
  console.log(`We currently have ${warnings.count} warnings`);

  // This prints all deferred warnings
  warnings.flush();

  // options is an array of "inputOptions" objects with an additional "output"
  // property that contains an array of "outputOptions".
  // The following will generate all outputs for all inputs, and write them to disk the same
  // way the CLI does it:
  for (const optionsObj of options) {
    const bundle = await rollup.rollup(optionsObj);
    await Promise.all(optionsObj.output.map(bundle.write));
  }

  // You can also pass this directly to "rollup.watch"
  const watcher = rollup.watch(options);
  watcher.on("event", (event) => {
    if (event.code === "BUNDLE_END") {
      log.info(`[Done]`, `Built done in ${event.duration}ms`);
      exec("yalc push", (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }
  });
});
