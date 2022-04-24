const { v4: uuidv4 } = require('uuid');

class Note {
  constructor(user, text) {
    this.uid = user;
    this.id = uuidv4();
    this.text = text;
    this.created = new Date().toLocaleString();
  }
}

module.exports = Note;
