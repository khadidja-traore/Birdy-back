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

  async get(friend_id) {
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("SELECT * FROM friends WHERE rowid = ?")
      stmt.get([friend_id], function (err, res) {
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

  async delete(friend_id) {
    return new Promise((resolve, reject) => {
      var stmt = this.db.prepare("DELETE FROM friends WHERE rowid = ?")
      stmt.run([friend_id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(friend_id)
        }
      })
    });
  }
}

exports.default = Friends;
