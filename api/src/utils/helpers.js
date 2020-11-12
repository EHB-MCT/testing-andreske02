
const {v1: uuidv1 } = require('uuid');

const Helpers = {
  generateUUID: () => {
     const uuid = uuidv1();  
     return uuid;
  },
  checkTitleLength: (title) => {
    if (typeof title !== "string") {
      return false
    }
    if (title[0].toUpperCase() !== title[0]) {
      return false
    }
    if (title.length >= 50) {
      return false
    }
    return title
  }
}





module.exports = Helpers