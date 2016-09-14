var IncomingWebhook = require('@slack/client').IncomingWebhook;

function write(results, options, done) {
  var webhookURL = process.env.SLACK_WEBHOOK_URL || options.slack_webhook_url || (options.globals || {}).slack_webhook_url
    , modules = results.modules || {}
    , attachments = []
    , message, wh, completed, skipped, color
  ;
  if (!webhookURL) {
    console.warn('[slack-reporter] Slack Webhook URL is not configured.');
    return done();
  }
  wh = new IncomingWebhook(webhookURL);

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
  wh.send(Object.assign({
    attachments: attachments
  }, message), done);
}

function reporter(results, done) {
  write(results, {}, done);
}

reporter.write = write;

module.exports = reporter;
