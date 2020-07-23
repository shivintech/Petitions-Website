const db = require('../../config/db');
const fs = require('mz/fs');


exports.getAll = async function() {
    const connection = await db.getPool().getConnection();
    try {
        const q = 'SELECT DISTINCT Petition.petition_id AS petitionId, Petition.title, Category.name AS category, User.name AS authorName, \n' +
            '    (select count(*) from Signature where Signature.petition_id = Petition.petition_id) AS signatureCount \n' +
            '    FROM Petition \n' +
            '    JOIN Category ON Petition.category_id = Category.category_id \n' +
            '    JOIN User ON User.user_id = Petition.author_id \n' +
            '    JOIN Signature ON Signature.petition_id = Petition.petition_id \n' +
            '    ORDER BY signatureCount DESC'
        const [rows, fields] = await connection.query(q);
        connection.release();
        return rows;
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};


exports.getAllByParameters = async function(whereQuery, sortingCondition, limit) {
    const connection = await db.getPool().getConnection();
    try {
        const q = 'SELECT DISTINCT Petition.petition_id AS petitionId, Petition.title, Category.name AS category, User.name AS authorName, ' +
            '(select count(*) from Signature where Signature.petition_id = Petition.petition_id) AS signatureCount ' +
            'FROM Petition ' +
            'JOIN Category ON Petition.category_id = Category.category_id ' +
            'JOIN User ON User.user_id = Petition.author_id ' +
            'LEFT JOIN Signature ON Signature.petition_id = Petition.petition_id ' +
           `${whereQuery}`+
           `${sortingCondition}`+
            ` ${limit}`;


        const [rows, fields] = await connection.query(q);
        connection.release();
        return rows;
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};


exports.getAllPetitionData = async function(p_id) {
    const connection = await db.getPool().getConnection();
    try {
        const q = "SELECT *, User.name as authorName, Category.name AS category FROM Petition JOIN User ON User.user_id = Petition.author_id JOIN Category ON Petition.category_id = Category.category_id  WHERE petition_id = ?";
        const [rows, _] = await connection.query(q, p_id);
        connection.release();
        return rows[0];
    } catch (err) {
        connection.release();
        return {"error": err};
    }};

exports.insertNewPetition = async function(newPetition) {
    let values = [newPetition.title, newPetition.author_id, newPetition.description, newPetition.category_id, newPetition.created_date, newPetition.closing_date];
    const connection = await db.getPool().getConnection();
    const q = 'INSERT INTO Petition (title, author_id, description, category_id, created_date, closing_date) VALUES (?, ?, ?, ?, ?, ?)';
    try {
        let [result, _] = await connection.query(q, values);
        connection.release();
        return {"id": result.insertId};
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};


exports.getSignatureCount = async function(p_id) {
    const connection = await db.getPool().getConnection();
    try {
        const q = 'SELECT Count(*) as "signatureCount" FROM Signature where petition_id = ?';
        const [rows, _] = await connection.query(q, p_id);
        connection.release();
        return rows[0];
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};

exports.getCategoryByCategoryId = async function(c_id) {
    console.log("in category")
    const connection = await db.getPool().getConnection();
    try {
        const q = 'SELECT * FROM Category WHERE category_id = ?';
        const [rows, _] = await connection.query(q, c_id);
        connection.release();
        return rows;
    }  catch (err) {
        connection.release();
        return {"error": err};
    }};

exports.getAllCategory = async function() {
    const connection = await db.getPool().getConnection();
    try {
        const q = 'SELECT * FROM Category';
        const [rows, fields] = await connection.query(q);
        connection.release();
        console.log("in query")
        console.log(rows);
        return rows;
    }  catch (err) {
        connection.release();
        return {"error": err};
    }
};

exports.getPhotoFromPetition = async function(p_id){
    console.log("in query")
    const connection = await db.getPool().getConnection();
    try {
        const q = "SELECT photo_filename FROM Petition WHERE petition_id = ?";
        const [rows, _] = await connection.query(q, p_id);
        connection.release();
        return rows[0];
    } catch (err) {
        connection.release();
        return {"error": err};
    }};

exports.getAuthorFromPetitionId = async function(p_id){
    console.log("in query")
    const connection = await db.getPool().getConnection();
    try {
        const q = "SELECT * FROM Petition WHERE petition_id = ?";
        const [rows, _] = await connection.query(q, p_id);
        connection.release();
        return rows[0];
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};

exports.UpdatePetitionPhoto = async function(p_id,photoName) {
    console.log("In the photo petition model");
    const connection = await db.getPool().getConnection();
    try {
        const q = 'Update Petition set photo_filename = ? WHERE petition_id = ?';
        const [rows, _] = await connection.query(q, [photoName, p_id]);
        connection.release();
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};

exports.deleteSelectedPetition = async function(p_id,auth_id) {

    const connection = await db.getPool().getConnection();
    try {
        const q = 'DELETE FROM Petition WHERE petition_id = ? AND author_id = ?';
        const [rows, _] = await connection.query(q, [p_id, auth_id]);
        connection.release();
    }catch (err) {
        connection.release();
        return {"error": err};

    }
};

exports.UpdatePetition = async function(p_id, petition_data, finalQuery) {
    const connection = await db.getPool().getConnection();

    console.log("in here");
    try {
        const q = 'Update Petition set ' + finalQuery + ' WHERE petition_id = ?';
        const [rows, _] = await connection.query(q, [p_id]);
        connection.release();
    }catch (err) {
        connection.release();
        return {"error": err};
    }
};