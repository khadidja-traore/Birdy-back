class Users {
  constructor(db) {
    this.db = db;
    this.db.exec("CREATE TABLE IF NOT EXISTS users (login VARCHAR(512) NOT NULL PRIMARY KEY, password VARCHAR(512) NOT NULL, lastname VARCHAR(256) NOT NULL, firstname VARCHAR(256) NOT NULL)");
  }

  create(login, password, lastname, firstname) {
    return new Promise((resolve, reject) => {
      let userid = 1; // À remplacer par une requête bd

      if(false) {
        //erreur
        reject();
      } else {
        resolve(userid);
      }
    });
  }

  get(userid) {
    return new Promise((resolve, reject) => {
      const user = {
         login: "pikachu",
         password: "1234",
         lastname: "chu",
         firstname: "pika"
      }; // À remplacer par une requête bd

      if(false) {
        //erreur
        reject();
      } else {
        if(userid == 1) {
          resolve(user);
        } else {
          resolve(null);
        }
      }
    });
  }

  async exists(login) {
    return new Promise((resolve, reject) => {
      var stmt = db.prepare("SELECT login FROM users WHERE login = ?")
      stmt.get([login], function(err, res){
        if(err) {
          reject(err)
        }else{
          resolve(res != undefined)
        }
      })
    });
  }

  checkpassword(login, password) {
    return new Promise((resolve, reject) => {
      let userid = 1; // À remplacer par une requête bd
      if(false) {
        //erreur
        reject();
      } else {
        resolve(userid);
      }
    });
  }

}

exports.default = Users;

