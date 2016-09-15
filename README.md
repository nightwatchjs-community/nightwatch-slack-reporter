nightwatch-slack-reporter
=========================

[![Travis CI](https://travis-ci.org/ngs/nightwatch-slack-reporter.svg?branch=master)](https://travis-ci.org/ngs/nightwatch-slack-reporter)
[![npm](	https://img.shields.io/npm/v/nightwatch-slack-reporter.svg)](https://www.npmjs.com/package/nightwatch-slack-reporter)

A @nightwatchjs reporter that notifies results to [Slack]

Install
-------

```sh
npm install --save-dev nightwatch-slack-reporter
```

Usage
-----

Using Built in Nightwatch reporter

```js
// globals.js
module.exports = {
  reporter: (require('nightwatch-slack-reporter')(options))
}
```

Using Command Line Options

```sh
nightwatch --reporter node_modules/nightwatch-slack-reporter/lib/reporter.js
```

Options
-------

You can configure Slack reporter options in [test globals] or [configuration file].

```js
options = {
  slack_message: function(results, options) { // function or message string
    return {
      text: 'Test completed, passed ' + results.passed + ', failed ' + results.failed,
      username: 'Nightwatch',
      icon_emoji: ':ghost:'
    } // Message payload or string
  },
  slack_webhook_url: 'https://hooks.slack.com/services/...'
  // This can be specified with SLACK_WEBHOOK_URL environment variable
}
```

Author
------

[Atsushi Nagase]

License
-------

[MIT License]

[Slack Incoming Webhook URL]: https://api.slack.com/incoming-webhooks
[configuration file]: http://nightwatchjs.org/guide#settings-file
[test globals]: http://nightwatchjs.org/guide#test-globals
[Atsushi Nagase]: http://ngs.io/
[MIT License]: LICENSE
[Slack]: https://slack.com/
