const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = async (user, callback) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const sql = `INSERT INTO users (name, mobile, email, gender, dob, qualification, working, department, experience, about, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [user.name, user.mobile, user.email, user.gender, user.dob, user.qualification, user.working, user.department, user.experience, user.about, hashedPassword];
    db.query(sql, values, callback);
};

const getUserByEmail = (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
};

module.exports = { createUser, getUserByEmail };