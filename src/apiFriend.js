const express = require("express");
const Friends = require("./entities/friends.js");

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
        next();
    });

    const friends = new Friends.default(db);

    // add new friendship
    router.post("/friends", async (req, res) => {
        const { firstUser, secondUser } = req.body;
        if (!firstUser || !secondUser) {
            console.log(firstUser);
            console.log(secondUser);
            res.status(400).send("At least one of the friend is missing!");
        } else {

            let friend_exist = await friends.exists(firstUser, secondUser)
            console.log(friend_exist);
            if (friend_exist) {
                res.status(400).json({ status: 400, message: "Déjà amis" });
                return;
            }


            friends.add(firstUser, secondUser)
                .then((friends_id) => res.status(201).send({ id: friends_id }))
                .catch((err) => res.status(500).send(err));
        }
    });

    // get one specific friendship
    // router.route("/friends/:friend_id(\\d+)").get(async (req, res) => {
    //     try {
    //         const friend = await friends.get(req.params.friend_id);
    //         console.log(friend);
    //         if (!friend)
    //             res.status(404).json({
    //                 status: 404,
    //                 message: "ami non trouvé"
    //             });
    //         else
    //             res.status(200).send(friend);
    //     }
    //     catch (e) {
    //         res.status(500).send(e);
    //     }
    // })

    router.route("/friends/:friend_name(\\w+)").get(async (req, res) => {
        try {
            const friend = await friends.get(req.params.friend_name);
            console.log(friend);
            if (!friend)
                res.status(404).json({
                    status: 404,
                    message: "ami non trouvé"
                });
            else
                res.status(200).send(friend);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
    // delete one specific freindship
    // .delete(async (req, res, next) => {
    //     try {
    //         const friend = await friends.get(req.params.friend_id);
    //         console.log(friend);
    //         if (!friend) {
    //             res.status(404).json({
    //                 status: 404,
    //                 message: "ami non trouvé"
    //             });
    //             return;
    //         }
    //         friends.delete(req.params.friend_id)
    //             .then((friend_id) => res.status(200).json({ status: "200", message: "Ami supprimé" }))
    //             .catch((err) => res.status(500).send(err));
    //     } catch (e) {
    //         res.status(500).json({
    //             status: 500,
    //             message: "erreur interne",
    //             details: (e || "Erreur inconnue").toString()
    //         });
    //     }
    // })

    router.route("/friends/:friend_name(\\w+)").delete(async (req, res, next) => {
        try {
            const friend = await friends.get(req.params.friend_name);
            console.log(friend);
            if (!friend) {
                res.status(404).json({
                    status: 404,
                    message: "ami non trouvé"
                });
                return;
            }
            friends.delete(req.params.friend_name)
                .then((friend_name) => res.status(200).json({ status: "200", message: "Ami supprimé" }))
                .catch((err) => res.status(500).send(err));
        } catch (e) {
            res.status(500).json({
                status: 500,
                message: "erreur interne",
                details: (e || "Erreur inconnue").toString()
            });
        }
    })

    // get the entire list of friends
    router.route("/friends").get(async (req, res) => {
        try {
            const friendsList = await friends.getList();
            console.log("The list of friends:")
            console.log(friendsList);
            if (!friendsList)
                res.sendStatus(404);
            else
                res.status(200).send(friendsList);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })

    //get the list of friend of a user 
    router.get("/friends/liste/:user_id(\\d+)", (req, res) => {


        const { login } = req.body; //users.exists(req.params.user_id);
        console.log("login :", login);
        friends.getFriendsOf(login)
            .then((liste) => {
                if (liste == []) {
                    console.log("liste vide");
                    res.status(400).json({ status: 400, message: "Pas de messages de vos amis" });
                } else {
                    console.log('liste non vide');
                    res.status(200).json({ status: 200, res: liste });
                }
            })
            .catch((err) => res.status(500).send(err));
    })





    return router;
}
exports.default = init;

