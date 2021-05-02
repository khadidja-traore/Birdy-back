class Friends {
  constructor(db) {
    this.db = db;
    this.db.exec("CREATE TABLE IF NOT EXISTS friends (firstUser VARCHAR(512) NOT NULL, secondUser VARCHAR(512) NOT NULL, timestamp TIMESTAMP, PRIMARY KEY('firstUser', 'secondUser'))");
    console.log("Friends table created");
  }

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

  // async get(friend_id) {
  //   return new Promise((resolve, reject) => {
  //     var stmt = this.db.prepare("SELECT * FROM friends WHERE rowid = ?")
  //     stmt.get([friend_id], function (err, res) {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(res);
  //       }
  //     })
  //   });
  // }

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

  // async delete(friend_id) {
  //   return new Promise((resolve, reject) => {
  //     var stmt = this.db.prepare("DELETE FROM friends WHERE rowid = ?")
  //     stmt.run([friend_id], function (err) {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(friend_id)
  //       }
  //     })
  //   });
  // }

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




  async exists(firstU, secondU){
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("SELECT * from friends WHERE (firstUser = ? AND secondUser = ? ) OR (firstUser = ? AND secondUser = ? )")
      stmt.get([firstU, secondU, firstU, secondU], function(err, res) {
        if (err){
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }



async getFriendsOf(user){
  return new Promise((resolve, reject) => {
    console.log("user :" ,user);
    var stmt = this.db.prepare("SELECT firstUser, secondUser from friends WHERE ( secondUser = ? ) OR (firstUser = ?)");
    stmt.all([user, user], function(err, res) {
      if (err){
        reject(err);
      } else {
        resolve(res);
      }
      
    })
  })
}

}



exports.default = Friends;

