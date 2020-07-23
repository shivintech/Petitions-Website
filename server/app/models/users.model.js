const db = require('../../config/db');
const fs = require('mz/fs');


exports.getById = async function(userId) {
    const connection = await db.getPool().getConnection();
    try {
        const q = 'SELECT * FROM User WHERE user_id = ?';
        const [rows, _] = await connection.query(q, userId);
        connection.release();
        if (typeof (rows) !== undefined) {
            return (rows[0]);
        }
    } catch (err) {
        connection.release();
        return rows;
    }
};

exports.getUserByToken = async function(token) {
    const connection = await db.getPool().getConnection();
    const q = 'SELECT * FROM User WHERE auth_token = ?';
    try {
    const [rows, _] = await connection.query(q, token);
    connection.release();
    return rows[0];
    } catch (err) {
        connection.release();
        return {"error": err};
    }

};

exports.register = async function(user_data) {
    let values = [user_data.name, user_data.email, user_data.password, user_data.city, user_data.country];
    const connection = await db.getPool().getConnection();
    const q = 'INSERT INTO User (name, email, password, city, country) VALUES (?, ?, ?, ?, ?)';
    try {
        let [result, _] = await connection.query(q, values);
        connection.release();
        return {"id": result.insertId};
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};

exports.getUserid = async function(email, password) {
    const connection = await db.getPool().getConnection();
    try {
        const q = 'Select user_id, password,email from User WHERE email = ?';
        const [rows, _] = await connection.query(q, [email]);
        connection.release();
        return rows;
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};

exports.insertToken = async function(token, email) {
    const connection = await db.getPool().getConnection();
    try {
       const q = 'Update User set auth_token = ? WHERE email = ?';
       const [rows, _] = await connection.query(q, [token, email]);
       connection.release();
       return token;
   } catch (err){
       connection.release();
       return {"error": err};
   }
};

exports.removeToken = async function(token) {
    const connection = await db.getPool().getConnection();
    try {
        const q = 'Update User set auth_token = NULL WHERE auth_token = ?';
        const [rows, _] = await connection.query(q, [token]);
        connection.release();
        return rows;
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};

exports.UpdateUser = async function(id, user_data, finalQuery) {
    const connection = await db.getPool().getConnection();
    try {
        const q = 'Update User set ' + finalQuery + ' WHERE user_id = ?';
        const [rows, _] = await connection.query(q, [id]);
        connection.release();
    }catch (err) {
        connection.release();
        return {"error": err};
    }
};

exports.getPhoto = async function(id){
    const connection = await db.getPool().getConnection();
    try {
        const q = "SELECT photo_filename FROM User WHERE user_id = ?";
        const [rows, _] = await connection.query(q, id);
        connection.release();
        return rows[0];
    } catch (err) {
        connection.release();
       return {"error": err};
}};

exports.removePhoto = async function(token) {
    const connection = await db.getPool().getConnection();
    try {
        const q = 'Update User set photo_filename = NULL WHERE auth_token = ?';
        const [rows, _] = await connection.query(q, [token]);
        connection.release();
        return rows;
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};



exports.UpdatePhoto = async function(id,photoName) {
    const connection = await db.getPool().getConnection();
    try {
        const q = 'Update User set photo_filename = ? WHERE user_id = ?';
        const [rows, _] = await connection.query(q, [photoName, id]);
        connection.release();
    }catch (err) {
        connection.release();
        return {"error": err};
    }

};

exports.checkEmail = async function (email) {
    const connection = await db.getPool().getConnection();
    try {
        const q = 'Select * from User where email = ?';
        const [rows, _] = await connection.query(q, [email]);
        connection.release();
        return rows[0];
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};