const Signatures = require('../models/signatures.model');
const Users = require('../models/users.model');
// const fs = require('mz/fs');

console.log("in signature controllers");

exports.getSignatureByPetitionId = async function(req, res) {
    try {
        let final_result = [];
        const id = req.params.petitionId;
        const dbData = await Signatures.getSignatures(id);
        if (dbData.length === 0) {
            res.statusMessage = 'Not Found'
            res.status(404).send();
            return;
        }
        for (i = 0; i < dbData.length; i++)
            final_result.push({
                signatoryId: dbData[i].signatory_id,
                name: dbData[i].name,
                city: dbData[i].city,
                country: dbData[i].country,
                signedDate: dbData[i].signed_date
            });
        res.status(200).send(final_result);
        return dbData;
    } catch (err) {
        res.status(500)
            .send(`ERROR getting Users ${err}`);
    }
};


exports.signPetition = async function(req, res) {
    try {
        var currentdate = new Date();
        const p_id = req.params.petitionId;
        var token = req.get("X-Authorization");
        console.log(token);
        const allPetitions = await Signatures.getAllPetitions(p_id)
        if (allPetitions.length === 0) {
            res.statusMessage = 'Not Found'
            res.status(404).send();
            return;
        }
        const specificUser =  await Users.getUserByToken(token);
        if((typeof(specificUser.auth_token) == 'undefined')) {
            res.status(401).send()
            return;
        }
        const dbData = await Signatures.getSignbyPetitionId(p_id, specificUser.user_id);
        if (dbData.length > 0 || allPetitions[0].closing_date < currentdate){
            console.log("in signing check");
            res.statusMessage = 'User can only sign 1 petition'
            res.status(403).send();
            return;
        }
        const signPetition = await Signatures.getUsertoSignPetition(p_id, specificUser.user_id, currentdate);
        if(signPetition.error){
            res.status(400).send("Error with SQL");
            return;
        }
        res.status(201).send();
    } catch (err) {
        res.status(500)
            .send(`ERROR getting Users ${err}`);
    }
};


exports.deleteSignature = async function(req, res) {
    try {
        var currentdate = new Date();
        const p_id = req.params.petitionId;
        var token = req.get("X-Authorization");
        const allPetitions = await Signatures.getAllPetitions(p_id);
        if(allPetitions.error){
            res.status(400).send("Error with SQL");
            return;
        }
        if(allPetitions.length === 0) {
            res.statusMessage = 'Not Found'
            res.status(404).send();
            return;
        }
        const specificUser =  await Users.getUserByToken(token);
        if((typeof(specificUser.auth_token) == 'undefined')) {
            res.status(401).send()
            return;
        }
        //checks if they created that petetion
        if(allPetitions[0].author_id === specificUser.user_id){
            res.status(403).send()
            return;
        }

        //checks if they sign that petetion
        const allSignatureBySignId= await Signatures.getAllSignaturebySignId(p_id)
        if(allSignatureBySignId.length === 0){
            res.statusMessage = 'Not Found'
            res.status(403).send();
            return;
        }
        //gives user with that has relation with the signature and petition
        const dbData = await Signatures.getSignbyPetitionId(p_id, specificUser.user_id);
        if(dbData.length === 0){
            res.statusMessage = 'Unauthorised'
            res.status(403).send();
            return;
        }
        if (allPetitions[0].closing_date < currentdate){
            console.log("its closed");
            res.status(403).send();
            return;
        }
        const removingPetitionSignature = await Signatures.removeSignature(specificUser.user_id, p_id);
        if(removingPetitionSignature.error){
            res.status(400).send("Something wrong with the SQL");
            return;
        }
        res.status(200).send();
    } catch (err) {
        res.status(500)
            .send(`ERROR getting Users ${err}`);
    }
};
