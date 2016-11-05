var mockery = require('mockery')
  , chai = require('chai')
  , expect = chai.expect
  ;

function createMockIncomingWebhook(send) {
  var usedWebhookURL;
  function IncomingWebhook(t) {
    usedWebhookURL = t;
  }
  IncomingWebhook.prototype.send = function(data, done) {
    send(usedWebhookURL, data);
    done();
  };
  return IncomingWebhook;
}

describe('Reporter', function() {
  var reporter
    , options
    , sentData
    , usedWebhookURL
    , results
    , subject
    , expectedAttachments
    ;

  beforeEach(function() {
    mockery.warnOnReplace(false);
    mockery.registerMock('@slack/client', {
      IncomingWebhook: createMockIncomingWebhook(function(t, data) {
        usedWebhookURL = t;
        sentData = data;
      })
    });
    mockery.enable();
    mockery.registerAllowable('../lib/reporter');
    mockery.registerAllowable('./fixtures/has_failure');
    reporter = require('../lib/reporter');
    options = function() {
      return {
        globals: {
          slack_webhook_url: 'https://www.foo.com/bar',
          slack_message: 'Test'
        }
      }
    };
    results = function() {
      return require('./fixtures/has_failure');
    };
    expectedAttachments = [
      {
        color: 'danger',
        title: 'Example Test',
        footer: '01_my_examples',
        text: '3 assertions, 21.77 seconds elapsed',
        fields: [{
          title: 'Test 3',
          value: 'Expected "true" but got: "false"'
        }]
      },
      {
        color: 'good',
        title: 'Example Test',
        footer: '02_my_second_examples',
        text: '2 assertions, 21.77 seconds elapsed',
        fields: []
      }
    ];
    expectedAttachmentsOnlyFailed = [
      {
        color: 'danger',
        title: 'Example Test',
        footer: '01_my_examples',
        text: '3 assertions, 21.77 seconds elapsed',
        fields: [{
          title: 'Test 3',
          value: 'Expected "true" but got: "false"'
        }]
      }
    ];
    subject = null;
  });

  function writeTests() {
    describe('uses specified webhook URL', function() {
      it('from options.globals', function(done) {
        subject(function() {
          expect(usedWebhookURL).to.equal('https://www.foo.com/bar');
          done();
        });
      });
      it('from options', function(done) {
        options = function() {
          return {
            slack_webhook_url: 'https://www.foo.com/bar'
          }
        };
        subject(function() {
          expect(usedWebhookURL).to.equal('https://www.foo.com/bar');
          done();
        });
      });
    });
    describe('writes report', function() {
      it('with message defined string in globals', function(done) {
        subject(function() {
          expect(sentData).to.deep.equal({
            text: 'Test',
            attachments: expectedAttachments
          });
          done();
        });
      });

      it('with message defined function in globals', function(done) {
        options = function() {
          return {
            globals: {
              slack_webhook_url: 'https://www.foo.com/bar',
              slack_message: function(results, options) {
                return 'Test completed, passed ' + results.passed + ', failed ' + results.failed
              }
            }
          }
        };
        subject(function() {
          expect(sentData).to.deep.equal({
            text: 'Test completed, passed 2, failed 1',
            attachments: expectedAttachments
          });
          done();
        });
      });
      
      it('with send only failed tests', function(done) {
        options = function() {
          return {
            globals: {
              slack_webhook_url: 'https://www.foo.com/bar',
              slack_message: function(results, options) {
                return 'Test completed, passed ' + results.passed + ', failed ' + results.failed
              },
              slack_send_only_failed_tests: true
            }
          }
        };
        subject(function() {
          expect(sentData).to.deep.equal({
            text: 'Test completed, passed 2, failed 1',
            attachments: expectedAttachmentsOnlyFailed
          });
          done();
        });
      });
      
      it('with send only on failure', function(done) {
        options = function() {
          return {
            globals: {
              slack_webhook_url: 'https://www.foo.com/bar',
              slack_message: function(results, options) {
                return 'Test completed, passed ' + results.passed + ', failed ' + results.failed
              },
              slack_send_only_on_failure: true
            }
          }
        };
        subject(function() {
          expect(sentData).to.deep.equal({
            text: 'Test completed, passed 2, failed 1',
            attachments: expectedAttachments
          });
          done();
        });
      });
    });
  }

  describe('#write', function() {
    beforeEach(function() {
      subject = function(done) {
        return reporter.write(results(), options(), done)
      };
    });
    writeTests();
  });
  describe('from exported', function() {
    beforeEach(function() {
      subject = function(done) {
        return reporter(options())(results(), done);
      };
    })
    writeTests();
  });
});
