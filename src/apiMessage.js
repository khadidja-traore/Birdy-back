const express = require("express");
const Messages = require("./entities/messages.js");
const Friends = require("./entities/friends.js");
const Users = require("./entities/users.js");

function init(mdb, db) {
    const router = express.Router();
    // On utilise JSON
    router.use(express.json());
    // simple logger for this router's requests
    // all requests to this router will first hit this middleware
    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
        
    });
    const messages = new Messages.default(mdb);
    const users = new Users.default(db);
    const friends = new Friends.default(db);

    router
        .route("/message/:author_id(\\d+)")

        //poster un message 
        .post( async (req, res) => {
            try {
                const {author_name, texte } = req.body;
                idAuthor = req.params.author_id;
           
                if (!author_name || !texte) {
                    res.status(400).json({
                        status: 400,
                        message: "Requête invalide : Champs manquants"
                    });
                    return;
                }

                messages.postMessageID(idAuthor,author_name,texte)
                .then((message_id) => res.status(201).send({id: message_id}))
                .catch((err) => res.status(500).send(err))
            
            } catch (e) {
                res.status(500).json({
                    status: 500,
                    message: "erreur interne",
                    details: (e || "Erreur inconnue").toString()
                });
            }
        })

        //modifier un message 
        .put(async (req, res) => {

            try {
                //const msg = await messages.exists(req.query.id);
                const {idMessage, texte} = req.body;
                const idAuthor = req.params.author_id;
                //console.log(idAuthor);

                messages.modifyMessage( idAuthor, idMessage, texte)
                .then((nb) => {
                    if (nb == 0){
                        res.status(401).json({status: 401, message: "Erreur le message n'existe pas"});
                        return;
                    } else {
                        res.status(200).json({status: 200, message: "Message modifié"});
                        return;
                    }
                })
                .catch((err) => res.status(500).send(err))

            
            } catch(e) {
                // Toute autre erreur
                res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
                });

            }

        })

        .delete(async (req, res) => {
            try {
                /*
                const msg = await messages.exists(req.params.author_id);

                if (!msg) {
                    res.status(401).json({
                    status: 401,
                    message: "Message non trouvé"
                    });
                    return;
                }
                */
                const idAuthor = req.params.author_id;
                const texte = req.body;
                console.log("dans apimessage avant l'appel de fonction, on a :", idAuthor, idMessage, texte)
                /*
                var idMessage = 0;
                messages.getMessageID(idAuthor, texte)
                .then((id) => {res.status(200).json({id_message: id});})
                .catch((err) => res.status(400).json({message : "requête invalide", erreur: err}))
                */

                messages.deleteMessage(idAuthor, idMessage, texte)
                .then((nb) => {
                    if (nb == 0){
                        res.status(401).json({status: 401, message: "Erreur le message n'existe pas"});
                        return;
                    } else {
                        res.status(200).json({status: 200, message: "Message supprimé"});
                        return;
                    }
                })
                .catch((err) => {console.log("erreur bd") ; res.status(500).send(err) })
                

            } catch(e) {
                res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
                });

            }
        });

        //affichage des messages d'un profil
        router.get("/message/:author_id(\\d+)", (req, res) => {

            try {
                const idAuthor = req.params.author_id;
                messages.getMessageFrom(idAuthor)
                .then( (docs) => {
                    if (docs == []) {
                        res.status(400).send("Vous n'avez pas de message")
                    } else {
                        res.status(200).send(docs)
                    }
                })
                .catch((err) => res.status(500).send(err))

            } catch(e) {

                res.status(500).json({
                    status: 500,
                    message: "erreur interne",
                    details: (e || "Erreur inconnue").toString()
                    });
            }

        });

        //affichage des messages pour la page d'acceuil
        router.get("/message", (req, res) => {

            try {

                messages.getAllMessage()
                .then( (docs) => {
                    if (docs == []) {
                        res.status(400).send("Il n'y a pas de message")
                    } else {
                        res.status(200).send(docs)
                    }
                })
                .catch((err) => res.status(500).send(err))

            } catch(e) {

                res.status(500).json({
                    status: 500,
                    message: "erreur interne",
                    details: (e || "Erreur inconnue").toString()
                    });
            }
        });

        //recherche d'un message avec query 
    
        router.get("/message/recherche/:author_id(\\d+)", async (req, res) => {
            try{
                //no_query = 0 si pas de query 1 sinon. no_list = 0 si pas de liste d'amis
                const {query, listfriend, no_query, no_list} = req.body     
                console.log(query, listfriend, no_query, no_list);

                if (!query && !listfriend) {
                    res.status(400).json({
                        status: 400,
                        message: "Requête invalide : paramètres manquants"
                    });
                    return;
                }
                

                messages.getMessageQuery(query, listfriend, no_query, no_list)
                .then((docs) => {
                    if (docs == []){
                        console.log("pas de messages trouvés");
                        res.status(200).json({status: 200, message: "Il n'y a pas de message."});
                    } else{
                        console.log("message trouvés");
                        res.status(201).send(docs);
                    }
                    
                })
                .catch((err) => res.status(500).send(err) )

            } catch(e) {
                res.status(500).json({
                    status: 500,
                    message: "erreur interne",
                    details: (e || "Erreur inconnue").toString()
                    });
                }

        });
        /*
        router.route("/message/comment/:author_id(\\d+)")
            //poster un commentaire 
            .post(async (req, res) => {
                try {
                    
                    const msg = await messages.exists(req.params.message_id);
                    if (!msg) {
                        res.status(401).json({
                        status: 401,
                        message: "Message non trouvé"
                        });
                        return;
                    }
                    

                    const { idMessage, idAuthor2, text2 } = req.body;
                    const idAuthor = req.params.author_id;

                    messages.postComment(idAuthor, idMessage, idAuthor2, text2)
                    .then((nb) => res.status(200).send({"nombre de commentaire posté": nb}))
                    .catch((err) => res.status(500).send(err))

                } catch(e) {
                    res.status(500).json({
                        status: 500,
                        message: "erreur interne",
                        details: (e || "Erreur inconnue").toString()
                        });
                }
            })
            //modifier un commentaire 
            /*
            .put(async (req, res) => {
                try {

                    const msg = await messages.exists(req.params.message_id);
                    if (!msg) {
                        res.status(401).json({
                        status: 401,
                        message: "Message non trouvé"
                        });
                        return;
                    }

                    const { idAuthor2, text2 } = req.body;
                    const idAuthor = req.params.author_id;
                    const idMessage = req.params.message_id;

                    messages.deleteComment(idAuthor, idMessage, idAuthor2, text)
                    .then((nb) => res.status(200).send({"nombre de commentaire supprimé": nb}))
                    .catch((err) => res.status(500).send(err))

                    messages.postComment(idAuthor, idMessage, idAuthor2, text2)
                    .then((nb) => res.status(200).send({"nombre de commentaire posté": nb}))
                    .catch((err) => res.status(500).send(err))

                } catch(e) {
                    res.status(500).json({
                        status: 500,
                        message: "erreur interne",
                        details: (e || "Erreur inconnue").toString()
                        });
                }

            })

            
            //supprimer un commentaire
            .delete(async(req, res) => {
                try {

                    const msg = await messages.exists(req.params.message_id);
                    if (!msg) {
                        res.status(401).json({
                        status: 401,
                        message: "Message non trouvé"
                        });
                        return;
                    }

                    const { idAuthor2, text2 } = req.body;
                    const idAuthor = req.params.author_id;
                    const idMessage = req.params.message_id;

                    messages.deleteComment(idAuthor, idMessage, idAuthor2, text2)
                    .then((nb) => res.status(200).send({"nombre de commentaire supprimé": nb}))
                    .catch((err) => res.status(500).send(err))


                } catch(e) {
                    res.status(500).json({
                        status: 500,
                        message: "erreur interne",
                        details: (e || "Erreur inconnue").toString()
                        });
                }
            })
            */


  
    return router;
}
exports.default = init;

