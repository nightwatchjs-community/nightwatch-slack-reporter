module.exports = {
  "passed": 2,
  "failed": 1,
  "errors": 0,
  "skipped": 0,
  "tests": 3,
  "errmessages": [],
  "modules": {
    "01_my_examples": {
      "completed": {
        "Example Test": {
          "passed": 2,
          "failed": 1,
          "errors": 0,
          "skipped": 1,
          "assertions": [
            {
              "message": "Test 1",
              "stackTrace": "",
              "fullMsg": "",
              "failure": false
            },
            {
              "message": "Test 2",
              "stackTrace": "",
              "fullMsg": "",
              "failure": false
            },
            {
              "message": "Test 3",
              "stackTrace": "    at Object.module.exports.Hoge",
              "fullMsg": "Testing if element <.hoge> is visible. \u001b[1;37m - expected \u001b[0;32m\"true\"\u001b[0m\u001b[0m but got: \u001b[0;31m\"false\"\u001b[0m",
              "failure": "Expected \"true\" but got: \"false\""
            }
          ],
          "timeMs": 21775,
          "time": "21.77"
        }
      },
      "skipped": [
        "Skipped 1"
      ],
      "time": "21.77",
      "timestamp": "Wed, 14 Sep 2016 05:40:10 GMT",
      "group": "",
      "tests": 1,
      "errmessages": [],
      "failures": 1,
      "errors": 0
    },
    "02_my_second_examples": {
      "completed": {
        "Example Test": {
          "passed": 2,
          "failed": 0,
          "errors": 0,
          "skipped": 0,
          "assertions": [
            {
              "message": "Test 1",
              "stackTrace": "",
              "fullMsg": "",
              "failure": false
            },
            {
              "message": "Test 2",
              "stackTrace": "",
              "fullMsg": "",
              "failure": false
            }
          ],
          "timeMs": 21775,
          "time": "21.77"
        }
      },
      "skipped": [],
      "time": "21.77",
      "timestamp": "Wed, 14 Sep 2016 05:40:10 GMT",
      "group": "",
      "tests": 1,
      "errmessages": [],
      "failures": 0,
      "errors": 0
    }
  },
  "assertions": 3
}
