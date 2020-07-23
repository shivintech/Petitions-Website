const db = require('../../config/db');
const fs = require('mz/fs');


exports.getSignatures = async function(petitionId) {
    const connection = await db.getPool().getConnection();
    try {
        const q = 'SELECT *, signatory_id FROM Signature JOIN User ON User.user_id = Signature.signatory_id where petition_id = ? order by signed_date ASC';
        const [rows, _] = await connection.query(q, petitionId);
        connection.release();
        return rows
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};

exports.getAllPetitions = async function(p_id) {
    const connection = await db.getPool().getConnection();
    try {
        const q = 'SELECT * FROM Petition where petition_id = ?';
        const [rows, _] = await connection.query(q, p_id);
        connection.release();
        return rows;
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};

exports.getSignbyPetitionId = async function(petitionId, id) {
    console.log("in query")
    const connection = await db.getPool().getConnection();
    try {
        const q = 'SELECT * FROM Signature where petition_id = ? AND signatory_id = ?';
        const [rows, _] = await connection.query(q, [petitionId, id]);
        connection.release();
        return rows
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};

exports.getSignatureByPetetionId = async function(petitionId) {
    const connection = await db.getPool().getConnection();
    try {
        const q = 'SELECT * FROM Signature where petition_id = ?';
        const [rows, _] = await connection.query(q, [petitionId, id]);
        connection.release();
        return rows
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};

exports.getAllSignaturebySignId = async function(p_id) {
    const connection = await db.getPool().getConnection();
    try {
        const q = 'SELECT * FROM Petition where petition_id = ?';
        const [rows, _] = await connection.query(q, p_id);
        connection.release();
        return rows
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};


exports.getUsertoSignPetition = async function(p_id, sign_id, currentdate){
    const connection = await db.getPool().getConnection();
    try {
        let values = [sign_id, p_id, currentdate];
        const q = 'INSERT INTO Signature (signatory_id, petition_id, signed_date) VALUES (?, ?, ?)'
        let [result, _] = await connection.query(q, values);
        connection.release();
        return {"id": result.insertId};
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};

exports.removeSignature = async function(sign_id, p_id) {

    const connection = await db.getPool().getConnection();
    try {
        const q = 'Delete from Signature WHERE signatory_id = ? AND petition_id = ?';
        const [rows, _] = await connection.query(q, [sign_id, p_id]);
        connection.release();
        return rows;
    } catch (err) {
        connection.release();
        return {"error": err};
    }
};

