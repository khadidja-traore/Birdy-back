class Friends {
  constructor(db) {
    this.db = db;
    this.db.exec("CREATE TABLE IF NOT EXISTS friends (firstUser VARCHAR(512) NOT NULL, secondUser VARCHAR(512) NOT NULL, timestamp TIMESTAMP, PRIMARY KEY('firstUser', 'secondUser'))");
    console.log("Friends table created");
  }

  //créer une amitié
  add(firstUser, secondUser) {
    let _this = this;
    return new Promise((resolve, reject) => {
      var stmt = _this.db.prepare("INSERT INTO friends VALUES (?,?,?)")
      stmt.run([firstUser, secondUser, Date.now()], function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      })
    });
  }
  //récupérer les informations des amitiés où friend_name est le second ami
  async get(friend_name) {
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("SELECT * FROM friends WHERE secondUser = ?")
      stmt.get([friend_name], function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      })
    });
  }

  //récupérer la liste de toutes les amitiés
  async getList() {
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("SELECT DISTINCT * FROM friends")
      stmt.all(function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      })
    });
  }
  //supprimer une amitié dont friend_name est le second ami
  async delete(friend_name) {
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("DELETE FROM friends WHERE secondUser = ?")
      stmt.run([friend_name], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(friend_name)
        }
      })
    });
  }
  //tester si deux utilisateurs sont amis
  async exists(firstU, secondU){
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("SELECT * from friends WHERE (firstUser = ? AND secondUser = ? ) OR (firstUser = ? AND secondUser = ? )")
      stmt.get([firstU, secondU, secondU, firstU], function(err, res) {
        if (err){
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
//récupérer la liste de tous les amis de l'utilisateur user
async getFriendsOf(user){
  return new Promise((resolve, reject) => {
    console.log("user :" ,user);
    var stmt = this.db.prepare("SELECT firstUser, secondUser from friends WHERE ( secondUser = ? ) OR (firstUser = ?)");
    stmt.all([user, user], function(err, res) {
      if (err){
        reject(err);
      } else {
        var friends = [];
        res.forEach(element => {
          if( element.firstUser != user && friends.indexOf(element.firstUser) == -1) friends.push(element.firstUser);
          if( element.secondUser != user && friends.indexOf(element.secondUser) == -1) friends.push(element.secondUser);
        });
        resolve(friends);
      }         
      
    })
  })
}

}

exports.default = Friends;

