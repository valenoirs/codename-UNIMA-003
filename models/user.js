const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    idUser: {type: String,  required: true, unique: true},
    email: {type: String,  required: [true, 'User email required!'], unique: true},
    password: {type: String, required: [true, 'User password required!']},
    birth: {type: Date, required: [true, 'User tanggal lahir required!']},
    name: {type: String,  required: [true, 'Username required!']},
    gender: {type: String, required: [true, 'User gender required']},
},
{
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
}));

module.exports = User;