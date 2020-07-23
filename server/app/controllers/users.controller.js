
const cryptoRandomString = require('crypto-random-string');
const Users = require('../models/users.model');
const bcrypt = require('bcryptjs');
const fs = require('mz/fs');

console.log("in controllers");

exports.getUserById = async function(req, res) {
    try {

        const id = req.params.userId;
        var token = req.get("X-Authorization");
        const result = await Users.getById(id);
        if((typeof(result) == 'undefined')){
            res.status(404).send()
            return;
        }
        console.log(result);
        const result2 = await Users.getUserByToken(token);
        if(result2.error){
            res.status(200)
                .json({
                    name: result.name,
                    city: result.city,
                    country: result.country
                });
        }

        if(result.error || result === "User Not Found"){
            res.status(404).send();
            return;
        }

        if(result2.user_id != id){
            res.status(403).statusMessage("Forbidden").send();
        }
        if(result2.user_id ==  id){

            res.status(200)
                .json({
                    name: result.name,
                    city: result.city,
                    country: result.country,
                    email: result.email
                });
        }
        else{
            res.status(200)
                .json({
                    name: result.name,
                    city: result.city,
                    country: result.country
                });
        }
    } catch (err) {
        res.status(500)
            .send(`ERROR getting Users ${err}`);
    }
};

        /*The function below creates the profile for the user in db*/
exports.create = async function(req, res) {

    let user_data = {
        'name': req.body.name,
        'email': req.body.email,
        'password': req.body.password,
    };

    for (let data in user_data) {
        if (user_data[data] === undefined) return res.status(400).send("Bad Request");
    }
    let checkMail = await Users.checkEmail(req.body.email);
    if(validateName (req.body.name) && validateEmail(req.body.email) && validatePassword((req.body.password)) && !(checkMail)) {
        try {
            let user_data = {
                'name': req.body.name,
                'email': req.body.email,
                'password': hashPassword(req.body.password),
                'city': req.body.city,
                'country': req.body.country,
            };
            const result = await Users.register(user_data);
            console.log(result);
            if (result.error) {
                if (result.error.code === 'ER_DUP_ENTRY') {
                    res.statusMessage = 'Bad Request: email already in use';
                    res.status(400).send();
                } else {
                    res.status(400).send();
                }
            } else {
                res.status(201)
                    .json({
                        userId: result.id
                    });
            }
        } catch (err) {
            res.status(500)
                .send(`ERROR posting user ${err}`);
        }
    }
    else {
        res.status(400)
            .send("Bad Request");
    }

};

exports.getUserPhoto = async function(req, res){
    try {
        const id = req.params.userId;
        const dbData = await Users.getPhoto(id);
        if(dbData.photo_filename == null){
            res.status(404).send()
            return;
        }
        photo_path = "storage/default/" + dbData.photo_filename;
        res.download(photo_path)
        return;
        } catch (err) {
        console.log(err);
        res.status(500)
            .send(`ERROR getting the photo`);
    }
};

exports.insertUserPhoto = async function(req, res){
    try {
        console.log("in insert photo");
        const id = req.params.userId;
        const user = await Users.getById(id);
        if((typeof(user) == 'undefined')){
            res.status(404).send("Not Found");
            return;
        }

        var token = req.get("X-Authorization");
        let photoType = req.headers["content-type"].split("/")[1];

        let photoName = `user_${id}.${photoType}`;
        let type_list = ["png", "jpeg", "gif", "jpg"];
        if(type_list.includes(photoType)){
            const dbData = await Users.getUserByToken(token);
            if((typeof(dbData.auth_token) == 'undefined')){
                res.status(401).send()
                return;
            }
            if(dbData.user_id != id){
                res.status(403).send()
                return;
            }
            console.log(dbData);
            if((typeof(dbData) == 'undefined')){
                res.status(401).send()
                return;
            }
            if(dbData.user_id == id){
                await fs.writeFile("storage/default/" + photoName, req.body, "binary", () => {})
                const result = await Users.UpdatePhoto(id, photoName)
                 if(dbData.photo_filename == null){
                     console.log(dbData.photo_filename);
                     res.status(201).send("Created")
                     return;
                 }
                 res.status(200).send("OK")
                return;
            }
        } else {
            res.status(400).send(`Bad Request`)
        }
        console.log(id);
    } catch (err) {
        console.log(err)
        res.status(500)
            .send(`ERROR getting the photo`);
    }
};

exports.deletePhoto = async function(req, res) {

    try {
        const id = req.params.userId;
        var token = req.get("X-Authorization");
        const dbData = await Users.getUserByToken(token); //gives all the user data including auth token
        if((typeof(dbData.auth_token) == 'undefined')){
            res.status(401).send("Unauthorised")
            return;
        }
        const user = await Users.getById(id);
        if((typeof(user) == 'undefined')){
            res.status(404).send("Not Found");
            return;
        }
        const deletingPhoto = await Users.removePhoto(token);
        if(deletingPhoto.error){
            res.status(400).send("Issue with SQL query");
            return;
        }
        if (deletingPhoto.changedRows === 0){
            res.statusMessage = 'Unauthorized';
            res.status(401).send();
            return;
        }
        res.status(200)
            .send();
    } catch (err) {
        res.status(500)
            .send(`ERROR getting Users ${err}`);
    }
};


exports.loggingIn = async function(req, res) {
    console.log("before try");
    try {
        console.log("in try");
        const email = req.body.email;
        const password = req.body.password;
        const result = await Users.getUserid(email, password);
        if (result.length === 0) {
            res.statusMessage = 'Bad Request: invalid email/password supplied'
            res.status(400).send();
            return;
        }
        if(await verifyCredentials(email, password, result[0].email,result[0].password)){
            var token = cryptoRandomString({length: 32, type: 'base64'});
            const result1 = await Users.insertToken(token, email);
            if(result1.error){
                res.status(400).send("Token not inserted,error with SQL");
                return;
            }
            res.status(200)
                .json({
                    userId: result[0].user_id,
                    token: result1
                });
        } else {
            res.statusMessage = 'Bad Request: invalid email/password supplied';
            res.status(400).send();
        }
    } catch (err) {
        console.log("in error");
        res.status(500)
            .send(`ERROR getting Users ${err}`);
    }
};
exports.loggingOut = async function(req, res) {

    try {
        var token = req.get("X-Authorization");
        const result = await Users.removeToken(token);
        if(result.error){
            res.status(400).send("Issue with SQL query");
            return;
        }
        if (result.changedRows === 0){
            res.statusMessage = 'Unauthorized';
            res.status(401).send();
            return;
        }
        res.status(200)
            .send();
    } catch (err) {
        res.status(500)
            .send(`ERROR getting Users ${err}`);
    }
};

        /*Helper function to validate the email*/
// "https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript/28804496"
function validateEmail(email) {
    if (email === undefined || email == null) return false;
    let re =/\S+@\S+/;
    return re.test(String(email).toLowerCase());
};

function validateName(name){
    if(name != undefined || name != null) {
        if (name.length > 0) {
            return true;
        }
    }
    console.log("false");
    return false;

};

/*Helper function to validate the password */
function validatePassword(password) {
    if(password != null|| password != undefined)
        return password.length > 0;
    return false;
}
        /*Helper function to encrypt the password*/
function hashPassword(password) {
    const salt = bcrypt.genSaltSync(8);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

        /*Helper function to compare  the password on logging in*/
async function verifyCredentials(email, password, dbEmail, dbPassword) {
    if(email === dbEmail){
        let isPasswordValid = await bcrypt.compare(password, dbPassword)
        return isPasswordValid
    }
    return false
};


exports.editingUser = async function(req, res) {

    try {
        const id = req.params.userId;
        var token = req.get("X-Authorization");
        const dbData = await Users.getUserByToken(token);
        if(dbData.error){
            res.status(401).send("Unauthorised")
            return;
        }
        if((typeof(dbData) == 'undefined')){
            res.status(404).send("Unauthorised")
            return;
        }

        var user1 = await Users.getById(token);
        console.log(user1);

        if(dbData.user_id != id){
            res.status(403).send("Forbidden")
            return;
        }
        let user = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            currentPassword: req.body.currentPassword,
            city: req.body.city,
            country: req.body.country,
        };
        let query = "";
       // console.log(user.email);
        const checkMail = await Users.checkEmail(user.email);
        console.log(typeof (checkMail));
        console.log(checkMail);


        if(typeof(checkMail) !== 'undefined'){
            console.log("in length");
            res.status(400).send("Email already in use by another user")
        }

        if((typeof(user.email) !== 'undefined')){
            if(validateEmail(req.body.email)){
             query += "email = '" + user.email + "', ";
        }}
        if((typeof(user.password) !== 'undefined')) {

            if (validatePassword(user.password)) {
                let isPasswordValid =  await bcrypt.compare(user.currentPassword, dbData.password);
                if (isPasswordValid) {
                    query += "password = '"+ user.password +  "', ";
                }
            }
        }
        if((typeof(user.name) !== 'undefined')){
            if(user.name !== ""){
                query += "name = '" + user.name + "', ";
            }
        }
        if((typeof(user.city) !== 'undefined')){
            if(user.city !== ""){
                query += "city = '" + user.city + "', ";
            }
        }
        if((typeof(user.country) !== 'undefined')){
            if(user.name !== ""){
                query += "country = '" + user.country  + "', ";
            }
        }
        let finalQuery = query.substring(0, query.length - 2);
        const updatingUser = await Users.UpdateUser(id,user,finalQuery);
      if(finalQuery.length == 0){
          res.status(400).send();
          return;
      }
        res.status(200)
            .send();
    } catch (err) {
        res.status(500)
            .send(`ERROR getting Users ${err}`);
    }
};

