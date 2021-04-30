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

        request
            .post('/apiFriend/friends') //créer une amitié
            .send(amis1)

            .then((res) => {
                res.should.have.status(201);
                console.log(`Retrieving friendship ${res.body.id}`)
                return Promise.all([
                    request
                        .get(`/apiFriend/friends/${res.body.id}`)   //récupérer id de l'amitié
                        .then((res) => {
                            res.should.have.status(200)
                           
                        }),

                    request
                        .get(`/apiFriend/friends/4`)
                        .then((res) => {
                            res.should.have.status(404)
                        }),

                    request
                        .post(`/apiFriend/friends`)
                        .send(amis1)
                        .then((res) => {
                            res.should.have.status(400)
                        }),

                    request
                        .post('/apiFriend/friends') //créer une amitié
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

            /*
        request
            .post('/apiFriend/friends') //créer une amitié
            .send(amis1)
            .then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })


        request
            .post('/apiFriend/friends') //créer une amitié
            .send(amis2)

            .then((res) => {
                return Promise.all([
                    request
                        .get(`/friends`)
                        .then((res) => {
                            res.should.have.status(200)
                        }),


                    request
                        .get(`/friends/liste/1`)
                        .send({login : "pikachu"})
                        .then((res)=>{
                            res.should.have.status(200)
                            chai.assert.deepEqual(res.body, {"status": 200,"res": ["mario","suzy"]})
                        

                        })

                ])
            })
            .then(() => done(), (err) => done(err))
            .finally(() => {
                request.close()
            })
                */
   })
    


