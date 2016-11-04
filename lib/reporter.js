var IncomingWebhook = require('@slack/client').IncomingWebhook
  , assign = require('object-assign')
  ;

function write(results, options, done) {
  var webhookURL = process.env.SLACK_WEBHOOK_URL || options.slack_webhook_url || (options.globals || {}).slack_webhook_url
    , sendOnlyOnFailure = options.slack_send_only_on_failure || (options.globals || {}).slack_slack_send_only_on_failure || false
    , sendOnlyFailedTests = options.slack_send_only_failed_tests || (options.globals || {}).slack_send_only_failed_tests || false
    , modules = results.modules || {}
    , attachments = []
    , message, wh, completed, skipped, color
  ;
  if (!webhookURL) {
    console.warn('[slack-reporter] Slack Webhook URL is not configured.');
    return done();
  }
  wh = new IncomingWebhook(webhookURL);
  
  if(sendOnlyOnFailure && results.failed < 1){
    return done();
  }

  message = options.slack_message || (options.globals || {}).slack_message || {};
  if (typeof message === 'function') {
    message = message.apply(this, [results, options]);
  }
  if (typeof message === 'string') {
    message = { text: message };
  }

  Object.keys(modules).map(function(moduleName) {
    var module = modules[moduleName] || {}
      , completed = module.completed || {}
      , fields = []
      ;
    Object.keys(completed).forEach(function(testName) {
      var test = completed[testName]
        , skipped = test.skipped > 0
        , failed = test.failed + test.errors > 0
        , assertions = test.assertions || []
        , color = failed ? 'danger' : skipped ? 'warning' : 'good'
        , text = assertions.length + ' assertions, ' + test.time + ' seconds elapsed'
        , fields = []
        ;

      if(sendOnlyFailedTests && failed < 1){
        return;
      }

      assertions.forEach(function(a) {
        if (a.failure) {
          fields.push({
            title: a.message,
            value: a.failure
          })
        }
      })

      attachments.push({
        color: color,
        title: testName,
        footer: moduleName,
        text: text,
        fields: fields
      });
    });
  });
  wh.send(assign({
    attachments: attachments
  }, message), done);
}

function reporter(options) {
  return function reporter(results, done) {
    write(results, options, done);
  }
}

reporter.write = write;

module.exports = reporter;
