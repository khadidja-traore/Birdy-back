// var Datastore = require('nedb')
//   , db = new Datastore();


//   var doc = { hello: 'world'
//                , n: 5
//                , today: new Date()
//                , nedbIsAwesome: true
//                , notthere: null
//                , notToBeSaved: undefined  // Will not be saved
//                , fruits: [ 'apple', 'orange', 'pear' ]
//                , infos: { name: 'nedb' }
//                };

// db.insert(doc, function (err, newDoc) {   // Callback is optional
//   // newDoc is the newly inserted document, including its _id
//   // newDoc has no key called notToBeSaved since its value was undefined
// });

// db.find({n:5}, function (err, docs) {
//     // docs is an array containing documents Mars, Earth, Jupiter
//     // If no document is found, docs is equal to []
//     console.log(docs);
//   });

// const getdocument = function(db) {
//     return new Promise((resolve, reject) => {
//         db.find({n:5},function(err, data) {
//             if (err) 
//                 reject(err); 
//             else 
//                 resolve(data);
//           });
//     })
// };

// getdocument(db).then((res) => {
//     console.log(res);
// })

var Datastore = require('nedb')
  , db = new Datastore();

db = {};
db.users = new Datastore();
db.robots = new Datastore();

// You need to load each database (here we do it asynchronously)
db.users.loadDatabase();
db.robots.loadDatabase();

i = {author_id: "158", author_name: "machin", date: new Date(Date.now()-60*60*1000), text: "Voila le texte du comentaire"};
db.users.insert(i);

i = {author_id: "158878", author_name: "truc", date: new Date(), text: "Voila le texte du comentaire"};
db.users.insert(i);


db.users.find({date:{$gt:new Date(Date.now()-60*60*1000)}},function(err,docs){
  console.log("message ancien ");
  console.log(docs);
});

const  getMessageID =function(idAuthor, text){
  return new Promise((resolve, reject) => {
  db.users.find({author_id: idAuthor,text: text},{author_id:1,_id:1},function(err,docs){
  if (err){
    reject(err);
  }else{
    console.log(docs[0]._id);
    id = docs[0]._id;
    resolve(id);
  }
})})};

getMessageID("158","Voila le texte du comentaire").then((id)=>{
  console.log("ici " + id);
  db.users.find({_id: id},{},function(err,docs){
    console.log("message 158 ");
    console.log(docs);
  });
});


// var inputDate = new Date(myDate.toISOString());
// MyModel.find({
//     'date': { $lte: inputDate }
// })

// ISODate
// $gte: '1987-10-19', $lte: '1987-10-26' } 
// - 60 * 60 * 1000;