var exec = require('child_process').exec;
require('babel-core/register')(); //babel polyfill ES6

process.on('warning', (warning) => {
  console.log(warning.name);
  console.log(warning.message);
  console.log(warning.stack);
});

var verbose = false;

if (process.argv[2] === '--v') {
  verbose = true;
}

var Jasmine = require('jasmine');
var jasmine = new Jasmine();
var SpecReporter = require('jasmine-spec-reporter');

//var customMatchers = require('./app/api/utils/jasmineMatchers.js');
//jasmine.getEnv().addMatchers(customMatchers);

var db_config = require('./app/api/config/database.js');
db_config.db_url = db_config.testing;

var elasticConfig = require('./app/api/config/elasticIndexes.js');
elasticConfig.index = elasticConfig.production;

jasmine.loadConfig({
  spec_dir: 'app/',
  spec_files: [
    'api/**/*[sS]pec.js',
    'shared/**/*[sS]pec.js'
  ],
  helpers: [
    '/api/utils/jasmineHelpers.js'
  ]
});

jasmine.addReporter(new SpecReporter({
  displayStacktrace: 'summary',
  displaySuccessfulSpec: verbose,
  displayFailedSpec: false,
  displaySpecDuration: true
}));

exec('./couchdb/restore_views.sh uwazi_testing', function () {
  jasmine.execute();
}).stdout.pipe(process.stdout);
