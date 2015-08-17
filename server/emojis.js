var table = require('emoji-emoticon-to-unicode')

function unicodeToChar (str) {
  return String.fromCharCode(parseInt(str, 16))
}

module.exports = function (text) {
  for (var key in table) {
    text = text.replace(key, unicodeToChar(table[key]))
  }

  return text
}
