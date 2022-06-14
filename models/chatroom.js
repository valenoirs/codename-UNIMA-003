const mongoose = require('mongoose');

// Chat schema
const PesanSchema = new mongoose.Schema({
    nama: {type:String},
    petugas: {type:Boolean},
    pesan: {type:String},
},
{
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
});

const Chatroom = mongoose.model('Chatroom', new mongoose.Schema({
    idChatroom: {type: String,  required: true, unique: true},
    idUser: {type: String,  required: true},
    idPetugas: {type: String,  required: true},
    nameUser: {type:String, required:true},
    namePetugas: {type:String, required:true},
    subject: {type: String,  required: true},
    disabled: {type:Boolean, required: true, default: false},
    pesan: {type:[PesanSchema], default: []},
},
{
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
}));

module.exports = Chatroom;