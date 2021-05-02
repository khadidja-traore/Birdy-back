const { resolve } = require("path");


class Messages {
  constructor(mdb) {
    this.mdb = mdb;
  }

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

  //liste des messages ayant un mot clé et/ou par amis
  //  async getMessageQuery(query, listfriend, no_query, no_list) {
  //       return new Promise((resolve, reject) => {
  //         console.log(listfriend, query, no_query, no_list);
  //         //_query = str(query);
  //         //console.log(_query);


  //         if (no_list == 1 && no_query == 0) {
  //           //que la recherche par mot clé
  //           console.log("que la recherche par mot clé");
  //           this.mdb.find({},{author_id: 1, author_name: 1, date: 1, text: 1}, function(err, docs){
  //             if (err){
  //                 reject(err);
  //             } else {
  //               console.log(docs);
  //               var res = [];
  //               docs.forEach(element => {
  //                 if ( element.text.indexOf(query) != -1 ){
  //                   res.push(element);
  //                 }
  //               });
  //               console.log(res);
  //               resolve(res);
  //             }
  //           });
  //         }

  //         if (no_query == 1 && no_list == 0) {
  //           //recherche que les messages des amis
  //           console.log("que la recherche des messages des amis");
  //           this.mdb.find({author_name: {$in: listfriend}},{author_id: 1, author_name: 1, date: 1, text: 1}, function(err, docs){
  //             if (err){
  //                 reject(err);
  //             } else {
  //               console.log(docs);
  //               resolve(docs);
  //             }
  //           });
  //         }

  //         //recherche par mot clé + filtre 
  //         console.log("recherche par mot clé et filtre");
  //         this.mdb.find({author_name: {$in: listfriend}},{author_id: 1, author_name: 1, date: 1, text: 1, comments : 1}, function(err, docs){
  //               if (err){
  //                   reject(err);
  //               } else {
  //                 console.log(docs);
  //                 var res = [];
  //                 docs.forEach(element => {
  //                   if ( element.text.indexOf(query) != -1 ){
  //                     res.push(element);
  //                   }
  //                 });
  //                 console.log(res);
  //                 resolve(res);

  //               }
  //           });

  //       });
  //   }


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
  /*
      async postComment(idAuthor, idMessage, idAuthor2, text2){
          return new Promise((resolve, reject) => {
              this.mdb.find({author_id: idAuthor, _id: idMessage},{comments : 1}, function(err, doc) {
                if (err){
                  reject(err)
                } else {
                  console.log(doc);
                  var temp = {author_id: idAuthor2, text: text2};// $push: { comments: {$each: temp} }
                  this.mdb.update({author_id: idAuthor, _id: idMessage}, {$set : {comment: temp} }, {}, function(err, numReplaced) {
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
  
      async postComment(idAuthor, idMessage, idAuthor2, text2){
        return new Promise((resolve, reject) => {
          var temp = [{author_id_c: idAuthor2, text_c: text2}];// $push: { comments: {$each: temp} }
          this.mdb.update({author_id: idAuthor, _id: idMessage}, {$set : {comments: temp} }, {}, function(err, numReplaced) {
          if (err){
            reject(err);
          } else {
            resolve(numReplaced);
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
    */
}

exports.default = Messages;