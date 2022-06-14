// Requiring module, packages, etc.
const {v4: uuidv4} = require('uuid');
const sendMail = require('../utils/sendEmail');

// Import Models
const User = require('../models/user');
const Ticket = require('../models/ticket');
const Petugas = require('../models/petugas');
const Chatroom = require('../models/chatroom');

// #region User
module.exports.Submit = async (req, res, next) => {
    try{
        const user = await User.findOne({idUser: req.body.idUser});

        req.body.emailUser = user.email;
        req.body.nameUser = user.name;
        req.body.idTicket = uuidv4();

        const newTicket = new Ticket(req.body);
        await newTicket.save();

        console.log(newTicket);

        console.log('Ticket submitted!');
        return res.redirect('/ticket')
    }
    catch(error){
        console.error('submit-ticket-error', error);
        req.flash('error', 'Ticket submit Error - Unknown Error');
        return res.redirect('/submit')
    }
};

module.exports.Cancel = async (req, res, next) => {
    try{
        const ticket = await Ticket.findOne({idTicket: req.body.idTicket});

        if(!ticket){
            console.log('404. Ticket not found!');
            req.flash('error', 'Tiket tidak ditemukan!');
            return res.redirect('/ticket');
        }

        await Ticket.updateOne({idTicket: req.body.idTicket}, {
            $set : {
                status: 'Dibatalkan'
            }
        })

        console.log('Ticket canceled!');
        return res.redirect('/ticket');
    }
    catch(error){
        console.error('cancel-ticket-error', error);
        req.flash('error', 'Cancel Ticket Error - Unknown Error');
        return res.redirect('/ticket')
    }
};

// #endregion

// #region Petugas
exports.Approve = async (req, res, next) => {
    try{
        const ticket = await Ticket.findOne({idTicket: req.body.idTicket});
        const petugas = await Petugas.findOne({idPetugas: req.session.idPetugas});

        if(!ticket){
            console.log('404. Ticket not found!');
            req.flash('error', 'Tiket tidak ditemukan');
            return res.redirect('/petugas/ticket');
        }

        console.log(req.body)

        const idChatroom = uuidv4();

        await Ticket.updateOne({idTicket: req.body.idTicket}, {
            $set : {
                idChatroom,
                idPetugas: req.session.idPetugas,
                namePetugas: petugas.name,
                status: 'Diterima'
            }
        })

        await Chatroom.insertMany({
            idChatroom,
            idUser: ticket.idUser,
            idPetugas: req.session.idPetugas,
            nameUser: ticket.nameUser,
            namePetugas: petugas.name,
            subject: ticket.subject,
        })

        sendMail(ticket.emailUser, 'Ticket anda diterima oleh petugas, anda dapat menghubungi petugas melalui WAILAN atau melalui link berikut : null');

        console.log('Ticket approved!');
        return res.redirect('/petugas/ticket');
    }
    catch(error){
        console.error('approve-ticket-error', error);
        req.flash('error', 'Approve Ticket Error - Unknown Error');
        return res.redirect('/petugas/ticket');
    }
}

exports.Decline = async (req, res, next) => {
    try{
        const ticket = await Ticket.findOne({idTicket: req.body.idTicket});
        const petugas = await Petugas.findOne({idPetugas: req.session.idPetugas});

        if(!ticket){
            console.log('404. Ticket not found!');
            req.flash('error', 'Tiket tidak ditemukan');
            return res.redirect('/petugas/ticket');
        }

        await Ticket.updateOne({idTicket: req.body.idTicket}, {
            $set : {
                idPetugas: req.session.idPetugas,
                namePetugas: petugas.name,
                status: 'Ditolak'
            }
        })

        sendMail(ticket.emailUser, 'Maaf, tiket yang anda submit tidak diterima oleh petugas, jika masih ada keluhan silahkan submit tiket yang baru, Terima Kasih.');

        console.log('Ticket declined!');
        return res.redirect('/petugas/ticket');
    }
    catch(error){
        console.error('decline-ticket-error', error);
        req.flash('error', 'Decline Ticket Error - Unknown Error');
        return res.redirect('/petugas/ticket')
    }
}
// #endregion

module.exports.Selesai = async (req, res, next) => {
    try{
        const ticket = await Ticket.findOne({idTicket: req.body.idTicket});

        if(!ticket){
            console.log('404. Ticket not found!');
            req.flash('error', 'Tiket tidak ditemukan!');
            return res.redirect('/ticket');
        }

        await Ticket.updateOne({idTicket: req.body.idTicket}, {
            $set : {
                status: 'Selesai',
                fixed: true
            }
        })

        await Chatroom.updateOne({idTicket: req.body.idTicket}, {
            $set : {
                disabled: true
            }
        })

        console.log('Ticket complete!');

        if(req.body.petugas === 'false'){
            return res.redirect('/ticket');
        }
        else{
            return res.redirect('/petugas/ticket');
        }
    }
    catch(error){
        console.error('completing-ticket-error', error);
        req.flash('error', 'Completing Ticket Error - Unknown Error');
        return res.redirect('/ticket')
    }
};