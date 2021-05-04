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
        res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        res.header("Access-Control-Allow-Credentials", "true");
        next();

    });
    const messages = new Messages.default(mdb);
    const users = new Users.default(db);
    const friends = new Friends.default(db);

    router
        .route("/message/:author_id(\\d+)")

        //poster un message 
        .post(async (req, res) => {
            try {
                const { author_name, texte } = req.body;
                idAuthor = req.params.author_id;

                if (!author_name || !texte) {
                    res.status(400).json({
                        status: 400,
                        message: "Requête invalide : Champs manquants"
                    });
                    return;
                }

                messages.postMessageID(idAuthor, author_name, texte)
                    .then((message_id) => res.status(201).send({ id: message_id }))
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
                const { idMessage, texte } = req.body;
                const idAuthor = req.params.author_id;

                messages.modifyMessage(idAuthor, idMessage, texte)
                    .then((nb) => {
                        if (nb == 0) {
                            res.status(401).json({ status: 401, message: "Erreur le message n'existe pas" });
                            return;
                        } else {
                            res.status(200).json({ status: 200, message: "Message modifié" });
                            return;
                        }
                    })
                    .catch((err) => res.status(500).send(err))
            } catch (e) {
                // Toute autre erreur
                res.status(500).json({
                    status: 500,
                    message: "erreur interne",
                    details: (e || "Erreur inconnue").toString()
                });
            }
        })

        //supprimer un message
        .delete(async (req, res) => {
            try {
                const idAuthor = req.params.author_id;
                const {idMessage} = req.body;
                console.log("dans apimessage avant l'appel de fonction, on a :", idMessage)

                messages.deleteMessage(idMessage)
                    .then((nb) => {
                        if (nb == 0) {
                            res.status(401).json({ status: 401, message: "Erreur le message n'existe pas" });
                            return;
                        } else {
                            res.status(200).json({ status: 200, message: "Message supprimé" });
                            return;
                        }
                    })
                    .catch((err) => { console.log("erreur bd"); res.status(500).send(err) })
            } catch (e) {
                res.status(500).json({
                    status: 500,
                    message: "erreur interne",
                    details: (e || "Erreur inconnue").toString()
                });

            }
        });

    //récupère tous les messages d'un utilisateur
    router.get("/message/:author_id(\\d+)", (req, res) => {

        try {
            const idAuthor = req.params.author_id;
            messages.getMessageFrom(idAuthor)
                .then((docs) => {
                    if (docs == []) {
                        res.status(400).send("Vous n'avez pas de message")
                    } else {
                        res.status(200).send(docs)
                    }
                })
                .catch((err) => res.status(500).send(err))

        } catch (e) {

            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }

    });

    //récupère l'ensemble des derniers messages postés
    router.get("/message", (req, res) => {

        try {

            messages.getAllMessage()
                .then((docs) => {
                    if (docs == []) {
                        res.status(400).send("Il n'y a pas de message")
                    } else {
                        res.status(200).send(docs)
                    }
                })
                .catch((err) => res.status(500).send(err))

        } catch (e) {

            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    });

    //recupère les messages ayant un mot clé 
    router.get("/message/recherche/:query(\\w+)", async (req, res) => {
        try {
            const tmp_query = req.params.query;
            if (!tmp_query) {
                res.status(400).json({
                    status: 400,
                    message: "Requête invalide : paramètres manquants"
                });
                return;
            }
            messages.getMessageQuery(tmp_query)
                .then((docs) => {
                    if (docs == []) {
                        console.log("pas de messages trouvés");
                        res.status(200).json({ status: 200, message: "Il n'y a pas de messages." });
                    } else {
                        console.log("messages trouvés");
                        res.status(201).send(docs);
                    }

                })
                .catch((err) => res.status(500).send(err))
                
        } catch (e) {
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

