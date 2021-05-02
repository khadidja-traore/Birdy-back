const { resolve } = require("path");


class Messages {
  constructor(mdb) {
    this.mdb = mdb;
  }

  //créer un message
  async postMessageID(idAuthor, login, text) {
    return new Promise((resolve, reject) => {
      this.mdb.insert({ author_id: idAuthor, author_name: login, date: new Date(), text: text }, function (err, newDoc) {
        if (err) {
          reject(err);
        } else {
          resolve(newDoc._id)
        }

      });
    });
  }
  //vérifier si un message existe
  async exists(idMessage) {
    return new Promise((resolve, reject) => {
      this.mdb.find({ _id: idMessage }, {}, function (err, doc) {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  }
  //récuperer l'id d'un message dont on connait l'auteur et le texte
  async getMessageID(idAuthor, texte) {
    return new Promise((resolve, reject) => {
      this.mdb.find({ author_id: idAuthor, text: texte }, { author_id: 1, _id: 1 }, function (err, doc) {
        if (err) {
          reject(err);
        } else {
          console.log(doc);
          resolve(doc._id);
        }
      });
    });
  }

  //liste des messages ayant un mot clé 
  async getMessageQuery(query) {
    console.log('getMessageQuery is called!');
    return new Promise((resolve, reject) => {
      console.log('The search query is: ' + query);
      this.mdb.find({}, { author_id: 1, author_name: 1, date: 1, text: 1 }, function (err, docs) {
        if (err) {
          reject(err);
        } else {
          console.log(docs);
          var res = [];
          docs.forEach(element => {
            if (element.text.indexOf(query) != -1) {
              res.push(element);
            }
          });
          console.log(res);
          resolve(res);
        }
      });
    });
  }

  //recupérer les messages d'un utilisateur
  async getMessageFrom(idAuthor) {
    return new Promise((resolve, reject) => {
      this.mdb.find({ author_id: idAuthor }, { author_id: 1, author_name: 1, date: 1, text: 1 }, function (err, docs) {
        if (err) {
          reject(err);
        } else {
          console.log(docs);
          resolve(docs);
        }

      });

    });
  }
  //récupérer les derniers messages postés
  async getAllMessage() {
    return new Promise((resolve, reject) => {
      this.mdb.find({ date: { $gt: new Date(Date.now() - 60 * 60 * 1000) } }, { author_id: 1, author_name: 1, date: 1, text: 1 }, function (err, docs) {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }

      });

    });
  }

  //supprimer un message
  async deleteMessage(idAuthor, idMessage, texte) {
    return new Promise((resolve, reject) => {
      this.mdb.remove({ _id: idMessage }, {}, function (err, numRemoved) {
        if (err) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      });
    });
  }

  //modifier un message
  async modifyMessage(idAuthor, idMessage, texte) {
    return new Promise((resolve, reject) => {
      this.mdb.update({ author_id: idAuthor, _id: idMessage }, { $set: { text: texte } }, {}, function (err, numReplaced) {
        if (err) {
          reject(err);
        } else {
          //retourne 0 ou 1
          resolve(numReplaced);
        }
      });
    });
  }
}

exports.default = Messages;