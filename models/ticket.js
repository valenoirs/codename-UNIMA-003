const mongoose = require('mongoose');

const Ticket = mongoose.model('Ticket', new mongoose.Schema({
    idTicket: {type: String,  required: true, unique: true},
    idUser: {type: String,  required: true},
    emailUser: {type: String,  required: true},
    nameUser: {type: String,  required: true},
    idPetugas: {type: String,  required: true, default: " "},
    namePetugas: {type: String,  required: true, default: " "},
    idChatroom: {type: String,  required: true, default: " "},
    subject: {type: String,  required: true},
    keterangan: {type: String,  required: true},
    fixed: {type: Boolean,  required: true, default: false},
    status: {type: String,  required: true, default: "Menunggu"},
},
{
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
}));

module.exports = Ticket;