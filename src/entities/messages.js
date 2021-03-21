const { resolve } = require("path");

class Messages {
    constructor(mdb) {
      this.mdb = mdb;
    }
  
    async postMessageID(idAuthor,login,text) {
      return new Promise((resolve, reject) => {
        this.mdb.insert({author_id: idAuthor, author_name: login, date: new Date(), text: text, comments : []}, function (err, newDoc) { 
            if (err){
                reject(err);
            } else {
                resolve(newDoc._id)
            }

        });
      });
    }

    async exists(idMessage) {
      return new Promise((resolve, reject) => {
        this.mdb.find({_id: idMessage}, {_id: 1}, function(err, doc) {
          if (err) {
            reject(err);
          } else {
            resolve(doc);
          }
        });
      });
    }

    //liste des messages ayant un mot clé et/ou par amis
   async getMessageQuery(query, listfriend=[]) {
        return new Promise((resolve, reject) => {
          if (listfriend == []) {
            //que la recherche par mot clé
            this.mdb.find({text: {$in: query }},{author_id: 1, author_name: 1, date: 1, text: 1, comments : 1}, function(err, docs){
              if (err){
                  reject(err);
              } else {
                  resolve(docs);
              }
            });
          }
          //recherche par mot clé + filtre 
          this.mdb.find({text: {$in: query }, author_name: {$in: listfriend}},{author_id: 1, author_name: 1, date: 1, text: 1, comments : 1}, function(err, docs){
                if (err){
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    async getMessageFrom(idAuthor){
        return new Promise((resolve, reject) => {
            this.mdb.find({author_id: idAuthor},{author_id: 1, author_name: 1, date: 1, text: 1, comments : 1}, function(err, docs) {
                if (err){
                    reject(err);
                } else {
                    resolve(docs);
                }

            });

        });
    }

    async getAllMessage() {
      return new Promise((resolve, reject) =>{
        this.mdb.find({},{author_id: 1, author_name: 1, date: 1, text: 1, comments : 1}, function(err, docs) {
          if (err){
              reject(err);
          } else {
              resolve(docs);
          }

        });

      });
    }


    async deleteMessage(idAuthor, idMessage){
        return new Promise((resolve, reject) =>{
            this.mdb.remove({author_id: idAuthor, _id: idMessage}, {}, function(err, numRemoved) {
                if (err) {
                    reject(err);
                } else {
                    resolve(numRemoved);
                }
            });
        });
    }


    async modifyMessage(idAuthor, idMessage, texte){
        return new Promise((resolve, reject) =>{
            this.mdb.update({author_id: idAuthor,_id: idMessage}, { $set : { text: texte }}, {}, function(err, numReplaced) {
                if (err){
                    reject(err);
                } else {
                    resolve(numReplaced);
                }
            });
        });
    }

    async postComment(idAuthor, idMessage, idAuthor2, text2){
        return new Promise((resolve, reject) => {
            this.mdb.find({author_id: idAuthor, _id: idMessage},{comments : 1}, function(err, doc) {
              if (err){
                reject(err)
              } else {
                var temp = {author_id: idAuthor2, text: text2};
                this.mdb.update({author_id: idAuthor, _id: idMessage}, { $push: { comments: {$each: temp} }}, {}, function(err, numReplaced) {
                  if (err){
                    reject(err);
                  } else {
                    resolve(numReplaced);
                  }
                });
              }
            });   
        });
    }

    //modifier un commentaire = supprimer + faire un nouveau commentaire  donc pas besoin de fonctions
    /*
    async modifyComment(idAuthor, idMessage, idAuthor2, text2){
      return new Promise((resolve, reject) => {
          this.mdb.find({author_id: idAuthor, _id: idMessage},{comments : 1}, function(err, doc) {
            if (err){
              reject(err)
            } else {
              var temp = {author_id: idAuthor2, text: text2}
              var tab = doc.push(temp);
              this.mdb.update({author_id: idAuthor, _id: idMessage}, { $set : { comments: tab }}, {}, function(err, numReplaced) {
                if (err){
                  reject(err);
                } else {
                  resolve(numReplaced);
                }
              });
            }
          });   
      });
  }
*/
  async deleteComment(idAuthor, idMessage, idAuthor2, text){
    return new Promise((resolve, reject) => {
        this.mdb.find({author_id: idAuthor, _id: idMessage},{comments : 1}, function(err, doc) {
          if (err){
            reject(err)
          } else {
            var temp = {author_id: idAuthor2, text: text}
            var pos = doc.indexOf(temp);
            var tab = doc.splice(pos, 1);
            this.mdb.update({author_id: idAuthor, _id: idMessage}, { $set : { comments: tab }}, {}, function(err, numReplaced) {
              if (err){
                reject(err);
              } else {
                resolve(numReplaced);
              }
            });
          }
        });   
    });
}
  
    async get(userid) {
      return new Promise((resolve, reject) => {
        var stmt = this.db.prepare("SELECT * FROM users WHERE rowid = ?")
        stmt.get([userid], function(err, res){
          if (err){
            reject(err);
          }else{
            resolve(res);
          }
        })
      });
    }
  
    async exists(login) {
      return new Promise((resolve, reject) => {
        var stmt = this.db.prepare("SELECT login FROM users WHERE login = ?")
        stmt.get([login], function(err, res){
          if(err) {
            reject(err)
          }else{
            resolve(res != undefined)
          }
        })
      });
    }
  
    async checkpassword(login, password) {
      return new Promise((resolve, reject) => {
        var stmt = this.db.prepare("SELECT rowid as user_id  FROM users WHERE login = ? and password = ?")
        stmt.get([login, password], function(err, res){
          if (err){
            reject(err);
          }else{
            if (res == undefined){
              resolve(res)
            } else {
              resolve(res.user_id);
            }
          }
        })
      });
    }
  
    async delete(userid) {
      return new Promise ((resolve, reject) => {
        var stmt = this.db.prepare("DELETE FROM users WHERE rowid = ?")
        stmt.run([userid], function(err){
          if(err){
            reject(err);
          }else{
            resolve(userid)
          }
        })
      });
    }
  
  }
  
  exports.default = Messages;