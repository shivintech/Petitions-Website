const Petitions = require('../models/petitions.model');
const Signatures = require('../models/signatures.model');
const Users = require('../models/users.model');
const fs = require('mz/fs');


exports.getAllPetitions = async function(req, res) {
    try {
        let query = "";
        const params = req.query;
        let sortingCondition = req.query.sortBy ? `${req.query.sortBy}` : 'ORDER BY signatureCount DESC';
        if (sortingCondition === 'SIGNATURES_ASC') {
            sortingCondition = ' ORDER BY signatureCount ASC';
        }

        if (sortingCondition === 'SIGNATURES_DESC') {
            sortingCondition = ' ORDER BY signatureCount DESC';
        }

        if (sortingCondition === 'ALPHABETICAL_ASC') {
            sortingCondition = 'ORDER BY Petition.title';
        }if (sortingCondition === 'ALPHABETICAL_DESC') {
            sortingCondition = 'ORDER BY Petition.title DESC ';
        }

        if(Object.keys(params).length != 0) {

            if (typeof (params.authorId) != 'undefined') {
                query += `Petition.author_id = ${params.authorId}`
            }
            if (typeof (params.categoryId) != 'undefined') {
                const categories = await Petitions.getCategoryByCategoryId(params.categoryId);
                if(categories.error){
                    res.status(400).send("Error with SQL");
                    return;
                }
                if ((categories.length) == 0) {
                    res.status(400).send("Bad Request: Category not found");
                    return;
                }

                if (query === '') {
                    query += `Category.category_id = ${params.categoryId}`
                } else {
                    query += ` AND Category.category_id = ${params.categoryId}`
                }
            }

            if (typeof (params.q) != 'undefined') {
                if (query === '') {
                    query += `Petition.title LIKE '%${params.q}%'`
                }
             else {
                query += ` AND Petition.title LIKE '%${params.q}%'`
            }
        }

            let count = params.count ? `${params.count}` : 500;
            let startIndex = params.startIndex ? `${params.startIndex}, ` : '';
            let limit = 'LIMIT ' + startIndex + count;
            let whereQuery = query ? `WHERE ${query} ` : '';
            console.log(whereQuery);
            let result = await Petitions.getAllByParameters(whereQuery, sortingCondition, limit);
            res.status(200).send(result)
            return;
        }
        const result = await Petitions.getAll();
        if(result.error){
            res.status(400).send("Error with SQL");
            return;
        }
        res.status(200).send(result)
    } catch (err) {
        res.status(500)
            .send(`ERROR getting Petitions ${err}`);
    }
};

exports.insertPetitions = async function(req, res) {

    try {
        const currentdate = new Date();
        const current_date_in_ms = currentdate.getTime();
        var token = req.get("X-Authorization");
        const users = await Users.getUserByToken(token);
        if((typeof(users) == 'undefined')){
            res.status(401).send("Unauthorised")
            return;
        }

        if((typeof(users.user_id) == 'undefined')){
            res.status(401).send("Unauthorised")
            return;
        }

        if((typeof(users.auth_token) == 'undefined')){
            res.status(401).send();
            return;
        }

        if(!(req.body.hasOwnProperty("title"))) {
            res.status(400).send();
            return;
        }

        let newPetition = {
            title: req.body.title,
            author_id: users.user_id,
            description: req.body.description,
            category_id: req.body.categoryId,
            created_date: currentdate,
            closing_date: req.body.closingDate
        };
        console.log(newPetition.closing_date);
        const petition_date_in_ms = new Date(newPetition.closing_date)
        const closeDate = petition_date_in_ms.getTime();
        if (current_date_in_ms > closeDate) {
            res.status(400).send("Bad Request: Closing date must be in future");
            return;
        }

        if((typeof(newPetition.category_id) !== 'undefined')) {
            const categories = await Petitions.getCategoryByCategoryId(newPetition.category_id);
            if(categories.error) {
                res.status(400).send("Error with SQL");
                return;
            }
            if ((categories.length) == 0) {
                res.status(400).send("Bad Request: Category not found");
                return;
            }
        }

        const insertingPetition = await Petitions.insertNewPetition(newPetition);
        res.status(201)
            .json({
                petitionId: insertingPetition.id
            });
    } catch (err) {
        res.status(500)
            .send(`ERROR getting Petitions ${err}`);
    }
};


exports.getDetailPetition = async function(req, res) {
    try {
        const p_id = req.params.petitionId;
        const petition = await Petitions.getAllPetitionData(p_id);
        if(petition.error){
            res.status(400).send("Error with SQL");
            return;
        }
        console.log(petition)
        if ((typeof(petition) == 'undefined')) {
            res.statusMessage = 'Not Found'
            res.status(404).send();
            return;
        }
       const count = await Petitions.getSignatureCount(p_id);
        if(count.error){
            res.status(400).send("Error with SQL");
            return;
        }
        console.log(count.signatureCount)
        console.log(petition.authorName);
        res.status(200)
            .json({
                petitionId: petition.petition_id,
                title: petition.title,
                description: petition.description,
                authorId: petition.author_id,
                authorName: petition.authorName,
                authorCity: petition.city,
                authorCountry: petition.country,
                signatureCount: count.signatureCount,
                category: petition.category,
                createdDate: petition.created_date,
                closingDate: petition.closing_date
            });
    } catch (err) {
        res.status(500)
            .send(`ERROR getting Petitions ${err}`);
    }
};


exports.deletePetition = async function(req, res) {
    try {
        var token = req.get("X-Authorization");
        const p_id = req.params.petitionId;
        const author = await Petitions.getAuthorFromPetitionId(p_id);
        if((typeof(author) == 'undefined')){
            res.status(404).send("Unauthorised");
            return;
        }
        const users = await Users.getUserByToken(token);
        if((typeof(users.user_id) == 'undefined')){
            res.status(401).send("Unauthorised")
            return;
        }
        if(users.user_id != author.author_id){
            res.status(403).send("Forbidden")
            return;
        }
        const deletingPetition = await Petitions.deleteSelectedPetition(p_id,author.author_id);
        res.status(200).send();
    } catch (err) {
        res.status(500)
            .send(`ERROR getting Petitions ${err}`);
    }
};
exports.editPetition = async function(req, res) {

    try {
        let query = "";
        var currentdate = new Date();
        var token = req.get("X-Authorization");
        const users = await Users.getUserByToken(token);
        if((typeof(users.user_id) == 'undefined')){
            res.status(401).send("Unauthorised")
            return;
        }
        const p_id = req.params.petitionId;
        const selectedPetition = await Petitions.getAuthorFromPetitionId(p_id);
        if((typeof(selectedPetition) == 'undefined')){
            res.status(404).send("Unauthorised");
            return;
        }
        if(users.user_id != selectedPetition.author_id){
            res.status(403).send("Forbidden")
            return;
        }
        console.log("------------------------------------------")
        console.log(selectedPetition)
        console.log(selectedPetition.closing_date)
        console.log(typeof (selectedPetition.closing_date))
        if (selectedPetition.closing_date !== null  && selectedPetition.closing_date.getTime() < currentdate.getTime()){
            console.log("its closed");
            res.status(403).send();
            return;
        }

        let petition = {
            title: req.body.title,
            description: req.body.description,
            author_id: req.body.author_id,
            category_id: req.body.category_id,
            created_date: req.body.created_date,
            closing_date: req.body.closing_date
        };
        if((typeof(petition.category_id) !== 'undefined')) {
            const categories = await Petitions.getCategoryByCategoryId(petition.category_id);
            if(categories.error) {
                res.status(400).send("Error with SQL");
                return;
            }
            if (petition.category_id !== categories.category_id) {
                res.status(400).send();
                return;
            }
            query += "category_id = '" + petition.category_id + "', ";
            console.log(query);
        }

        if((typeof(petition.title) !== 'undefined')){
            if(petition.city !== ""){
                query += "title = '" + petition.title + "', ";
                console.log(query);
            }
        }
        if((typeof(petition.description) !== 'undefined')){
            if(petition.description !== ""){
                query += "description = '" + petition.description + "', ";
                console.log(query);
            }
        }
        let finalQuery = query.substring(0, query.length - 2);
        console.log(finalQuery)
        const updatingPetition = await Petitions.UpdatePetition(p_id,petition,finalQuery);
        res.status(200).send();
    } catch (err) {
        res.status(500)
            .send(`ERROR getting Petitions ${err}`);
    }
};



exports.getCategory = async function(req, res) {
    try {

        let final_result = [];
        const dbData = await Petitions.getAllCategory();
        if(dbData.error){
            res.status(400).send("Error with SQl");
            return;
        }

        if (typeof (dbData) == 'undefined') {
            res.status(400).send();
            return;
        }

        if (dbData.length === 0) {
            res.statusMessage = 'Not Found'
            res.status(404).send();
            return;
        }
        for (i = 0; i < dbData.length; i++)
            final_result.push({
                categoryId: dbData[i].category_id,
                name: dbData[i].name,
            });
        res.status(200).send(final_result);
    } catch (err) {
        res.status(500)
            .send(`ERROR getting Petitions ${err}`);
    }
};

exports.getPetitionPhoto = async function(req, res){
    try {
        console.log("in getPetitionPhoto")
        const p_id = req.params.petitionId;
        const allPetitions = await Signatures.getAllPetitions(p_id)
        if (allPetitions.length === 0) {
            res.statusMessage = 'Not Found'
            res.status(404).send();
            return;
        }
        const dbData = await Petitions.getPhotoFromPetition(p_id);
        if(dbData.photo_filename == null){
            res.status(404).send()
            return;
        }
        photo_path = "storage/default/" + dbData.photo_filename;
        res.download(photo_path)
    } catch (err) {
        console.log(err);
        res.status(500)
            .send(`ERROR getting the photo`);
    }
};
//
exports.insertPetitionPhoto = async function(req, res){
    try {
        console.log("in insert photo");
        const p_id = req.params.petitionId;
        var token = req.get("X-Authorization");
        const author = await Petitions.getAuthorFromPetitionId(p_id);
        if((typeof(author) == 'undefined')){
            res.status(404).send("Unauthorised");
            return;
        }
        const users = await Users.getUserByToken(token);
        if((typeof(users.user_id) == 'undefined')){
            res.status(401).send("Unauthorised")
            return;
        }
        if(users.user_id != author.author_id){
            res.status(403).send("Forbidden")
            return;
        }
        let photoType = req.headers["content-type"].split("/")[1];
        let photoName = `petition_${p_id}.${photoType}`;
        let type_list = ["png", "jpeg", "gif", "jpg"];
        if(type_list.includes(photoType)){

            if(users.user_id == author.author_id){
                await fs.writeFile("storage/default/" + photoName, req.body, "binary", () => {})
                const result = await Petitions.UpdatePetitionPhoto(p_id, photoName)
                if(author.photo_filename == null){
                    res.status(201).send("Created")
                    return;
                }
                res.status(200).send("OK")
                return;
            }
        } else {
            res.status(400).send(`Bad Request`)
        }
    } catch (err) {
        console.log(err)
        res.status(500)
            .send(`ERROR getting the photo`);
    }
};