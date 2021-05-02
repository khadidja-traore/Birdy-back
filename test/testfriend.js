const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../src/app.js'); // c'est l'app "express"
//import { describe, it } from 'mocha'
const mocha = require('mocha');

// Configurer chai
chai.use(chaiHttp);
chai.should();

mocha.describe("Test de l'API friend", () => {
    mocha.it("friend", (done) => {
        const request = chai.request(app.default).keepOpen();
        const amis1 = {
            firstUser: "pikachu",
            secondUser: "mario",
           
        };

        const amis2 = {
            firstUser: "suzy",
            secondUser: "pikachu"
        };

        const user1 = {
            login: "pikachu",
            password: "1234",
            lastname: "chu",
            firstname: "pika"
        };

        const user2 = {
            login: "mario",
            password: "1234",
            lastname: "rio",
            firstname: "ma"
        };


        const user3 = {
            login: "suzy",
            password: "1234",
            lastname: "zy",
            firstname: "su"
        };


        request
            .post('/apiFriend/friends') //créer une amitié
            .send(amis1)

            .then((res) => {
                res.should.have.status(401); //erreur 401 ami inconnu
                //console.log(`Retrieving friendship ${res.body.id}`)
                //chai.assert.deepEqual(res.body, "id: 1")
                return Promise.all([

                    
                    //création des utilisateurs

                    request
                        .post('/apiUser/user') 
                        .send(user2)
                        .then((res) => {
                            res.should.have.status(200)
                           
                        }),

                    request
                        .post('/apiUser/user') 
                        .send(user3)
                        .then((res) => {
                            res.should.have.status(200)
                           
                        }),

                    //créer une amitié
                    request
                        .post('/apiFriend/friends')
                        .send(amis1)
                        .then((res) => {
                            res.should.have.status(201);
                            console.log(`Retrieving friendship ${res.body.id}`)
                            chai.assert.deepEqual(res.body, "id: 1")
                        }),

                    request
                        .get(`/apiFriend/friends/${res.body.id}`)   //récupérer id de l'amitié
                        .then((res) => {
                            res.should.have.status(200)
                           
                        }),

                    request
                        .get(`/apiFriend/friends/4`)
                        .then((res) => {
                            res.should.have.status(404) //erreur 404 ami non trouvé
                        }),

                    request
                        .post(`/apiFriend/friends`)
                        .send(amis1)
                        .then((res) => {
                            res.should.have.status(400)  //erreur 400 Déjà amis
                        }),

                    request
                        .post('/apiFriend/friends') //création de la 2e amitié
                        .send(amis2)
                        .then((res) => {
                            res.should.have.status(201)
                        }),


                    request
                        .get(`/apiFriend/friends`),

                    
/*
                    request
                        .get(`/apiFriend/friends/liste/1`)
                        .send({login : "pikachu"})
                        .then((res)=>{
                            res.should.have.status(200)
                            chai.assert.deepEqual(res.body, {"status": 200,"res": ["mario","suzy"]})
                        

                        }),

                    request
                        .delete(`apiFriend/friends/${res.body.id}`)
                        .then((res) => {
                            res.should.have.status(200)
                        }),
*/                        
                ])
            }).then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })

    })

   })
    


