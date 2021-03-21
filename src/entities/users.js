class Users {
  constructor(db) {
    this.db = db;
    this.db.exec("CREATE TABLE IF NOT EXISTS users (login VARCHAR(512) NOT NULL PRIMARY KEY, password VARCHAR(512) NOT NULL, lastname VARCHAR(256) NOT NULL, firstname VARCHAR(256) NOT NULL)");
  }

  create(login, password, lastname, firstname) {
    let _this = this
    return new Promise((resolve, reject) => {
      var stmt = _this.db.prepare("INSERT INTO users VALUES (?,?,?,?)")
      stmt.run([login, password, lastname, firstname], function(err, res){
        if (err){
          reject(err);
        }else{
          resolve(this.lastID);    
        }
      })
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

exports.default = Users;

