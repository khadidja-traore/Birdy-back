class Users {
  constructor(db) {
    this.db = db;
    this.db.exec("CREATE TABLE IF NOT EXISTS users (login VARCHAR(512) NOT NULL PRIMARY KEY, password VARCHAR(512) NOT NULL, lastname VARCHAR(256) NOT NULL, firstname VARCHAR(256) NOT NULL)");
  }

  //créer un utilisateur
  create(login, password, lastname, firstname) {
    let _this = this
    return new Promise((resolve, reject) => {
      var stmt = _this.db.prepare("INSERT INTO users VALUES (?,?,?,?)")
      stmt.run([login, password, lastname, firstname], function(err, res){
        if (err){
          reject(err);
        }else{
          console.log("Utilisateur créé");
          resolve(this.lastID);    
        }
      })
    });
  }
  //récupérer les données d'un utilisateur
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
  //récupérer l'id et le login de tous les utilisateurs
  async getall() {
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("SELECT rowid as id, login FROM users ")
      stmt.all([], function(err, res){
        if (err){
          reject(err);
        }else{
          resolve(res);
        }
      })
    });
  }
  //vérifier si un utilisateur existe
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
  //tester si utilisateur est bien inscrit dans la BD
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
  //supprimer un utilisateur
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

exports.default = Users;

