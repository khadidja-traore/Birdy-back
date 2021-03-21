const express = require("express");
const Messages = require("./entities/messages.js");

function init(mdb) {
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
    
    //poster un message 
    router.post("/message/", async (req, res) => {
        try {
            const { author_id, author_name, texte } = req.body;
           
            if (!author_name || !texte ) {
                res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : Champs manquants"
                });
                return;
            }

            messages.postMessageID(author_id,author_name,texte)
            .then((message_id) => res.status(200).send({id: message_id}))
            .catch((err) => res.status(500).send(err))
            
        } catch (e) {
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    });


    router
        .route("/message/:author_id(\\d+)/:message_id(\\w)")
        //modifier un message 
        .put(async (req, res) => {

            try {
                console.log("je passe ici 1")
                const msg = await messages.exists(req.params.message_id);

                if (!msg) {
                    console.log("je passe ici 2")
                    res.status(401).json({
                    status: 401,
                    message: "Message non trouvé"
                    });
                    return;
                }
                console.log("je passe ici 3")
                const texte = req.body;
                const idAuthor = req.params.author_id;
                const idMessage = req.params.message_id;

                messages.modifyMessage(idAuthor, idMessage, texte)
                .then((nb) => res.status(200).send({"nombre de message modifié": nb}))
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

                const msg = await messages.exists(req.params.message_id);
                if (!msg) {
                    res.status(401).json({
                    status: 401,
                    message: "Message non trouvé"
                    });
                    return;
                }

                messages.deleteMessage(idAuthor, idMessage)
                .then((nb) => res.status(200).send({"nombre de message supprimé": nb}))
                .catch((err) => res.status(500).send(err))

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

                messages.getMessageFrom(idAuthor)
                .then( (docs) => {
                    if (docs == []) {
                        res.status(200).send("Vous n'avez pas de message")
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

                messages.getAllMessage(idAuthor)
                .then( (docs) => {
                    if (docs == []) {
                        res.status(200).send("Il n'y a pas de message")
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
        router.get("/message/:author_id(\\d+)", (req, res) => {



        });


        router.route("/message/comment/:author_id(\\d+)/:message_id(\\d+)")
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

                    const { idAuthor2, text2 } = req.body;
                    const idAuthor = req.params.author_id;
                    const idMessage = req.params.message_id;

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

            */
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


   
    router.delete("/user/logout/:user_id(\\d+)", (req, res) => {

        userid = req.params.user_id;
        
        if(req.session.userid != userid){
            res.status(403).json({status: 403, message: "Pas la bonne session"});
            return;
        }
        
       console.log(req.session);
       
       if(req.session.userid == userid){
            req.session.destroy((err) => {
                if (err){
                    res.status(500).json({status: 500, message: "Erreur interne"})
                } else {
                    res.status(200).json({status: 200, message: "Déconnexion réussie"})
                }
            })
        } else {
            res.status(409).json({status: 409, message: "Pas de session en cours"})
        }

    });

    router
        .route("/user/:user_id(\\d+)")
        .get(async (req, res) => {
        try {
            const user = await users.get(req.params.user_id);
            if (!user)
                res.status(401).json({
                    status: 401,
                    message: "utilisateur non trouvé"
                });
            else
                res.send(user);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
        .delete(async (req, res, next) => {
            try {

                userid = req.params.user_id;
        
                if(req.session.userid != userid){
                    res.status(403).json({status: 403, message: "Suppresion interdite"});
                    return;
                }

                const user = await users.get(req.params.user_id);

                if (!user) {
                    res.status(401).json({
                    status: 401,
                    message: "utilisateur non trouvé"
                     });
                     return;
                }
                users.delete(req.params.user_id)
                .then((user_id) => res.status(201).json({status: "200", message: "Utilisateur supprimé"}))
                .catch((err) => res.status(500).send(err));
             

            } catch(e) {
                res.status(500).json({
                    status: 500,
                    message: "erreur interne",
                    details: (e || "Erreur inconnue").toString()
                });
            }
            

    })

    router.post("/user", async (req, res) => {                   //création 
        try{
            const { login, password, lastname, firstname } = req.body;
            if (!login || !password || !lastname || !firstname) {
                res.status(400).send("Missing fields");
                return;
            } 

            if( await users.exists(login)) {
                res.status(409).json({
                    status: 409,
                    message: "Utilisateur déja existant"
                });
            return;

            }
            users.create(login, password, lastname, firstname)
                .then((user_id) => res.status(201).send({ id: user_id }))
                .catch((err) => res.status(500).send(err));

        }catch(e){
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
        
        
    });

    return router;
}
exports.default = init;

