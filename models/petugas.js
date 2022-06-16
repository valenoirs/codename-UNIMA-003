const mongoose = require('mongoose');

const Petugas = mongoose.model('Petugas', new mongoose.Schema({
    idPetugas: {type: String,  required: true, unique: true},
    name: {type: String,  required: [true, 'Petugas nama required!']},
    email: {type: String,  required: [true, 'Petugas email required!'], unique: true},
    password: {type: String, required: [true, 'Petugas password required!']},
},
{
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
}));

module.exports = Petugas;