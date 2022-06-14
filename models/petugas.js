const mongoose = require('mongoose');

const Petugas = mongoose.model('Petugas', new mongoose.Schema({
    idPetugas: {type: String,  required: true, unique: true},
    email: {type: String,  required: [true, 'Petugas email required!'], unique: true},
    password: {type: String, required: [true, 'Petugas password required!']},
    birth: {type: Date, required: [true, 'Petugas tanggal lahir required!']},
    name: {type: String,  required: [true, 'Petugas nama required!']},
    gender: {type: String, required: [true, 'Petugas gender required']},
},
{
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
}));

module.exports = Petugas;