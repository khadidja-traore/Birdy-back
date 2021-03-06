const express = require("express");
const Users = require("./entities/users.js");

function init(db) {
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

    const users = new Users.default(db);

    //login
    router.post("/user/login", async (req, res) => {
        try {
            const { login, password } = req.body;
            // Erreur sur la requête HTTP
            if (!login || !password) {
                res.status(400).json({
                    status: 400,
                    "message": "Requête invalide : login et password nécessaires"
                });
                return;
            }
            if(! await users.exists(login)) {
                res.status(401).json({
                    status: 401,
                    message: "Utilisateur inconnu"
                });
                return;
            }
            let userid = await users.checkpassword(login, password);
            if (userid) {
                // Avec middleware express-session
                req.session.regenerate(function (err) {
                    if (err) {
                        res.status(500).json({
                            status: 500,
                            message: "Erreur interne"
                        });
                    }
                    else {
                        // C'est bon, nouvelle session créée
                        req.session.userid = userid;
                        console.log("id de la session", req.session.userid);
                        res.status(200).json({
                            status: 200,
                            message: "Login et mot de passe accepté",
                            id_user: userid
                        });
                    }
                });
                return;
            }
            // Faux login : destruction de la session et erreur
            req.session.destroy((err) => { });
            res.status(403).json({
                status: 403,
                message: "login et/ou le mot de passe invalide(s)"
            });
            return;
        }
        catch (e) {
            // Toute autre erreur
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    });

    //logout
    router.delete("/user/logout/:user_id(\\d+)", (req, res) => {

        userid = req.params.user_id;
        console.log("id en paramètres", userid);
        console.log("id de la session", req.session.userid )
        
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

    //récupérer les informations d'un utilisateur
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
                res.status(200).send(user);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
    //supprimer un utilisateur
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

    //création d'un utilisateur
    router.post("/user", async (req, res) => {   
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

    //récupère la liste de tous les utilisateurs inscrits 
    router.get("/user/all", async (req, res) => {
        try{
            users.getall()
            .then((tab) => res.status(200).send(tab))
            .catch((err) => res.status(500).send(err));

        }catch(e){
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    })

    return router;
}
exports.default = init;

