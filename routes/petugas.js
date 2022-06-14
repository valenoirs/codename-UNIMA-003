const express = require('express');
const router = express.Router();
const PetugasController = require('../controllers/petugas');

// Import Models
const Ticket = require('../models/ticket');
const Chatroom = require('../models/chatroom');

// Post
router.post('/login', PetugasController.Login);
router.post('/register', PetugasController.Register);

// Logout
router.get('/logout', PetugasController.Logout);

// Get
router.get('/login', (req, res) => {
    if(!req.session.idPetugas){
        res.render('petugas/login', {title: 'Login - Petugas', layout: 'layouts/petugas-layout', error: req.flash('error')});

    }
    else{
        res.redirect('/petugas');
    }
});

router.get('/wailan/kominfo/tomohon/register', (req, res) => {
    if(!req.session.idPetugas){
        res.render('petugas/register', {title: 'Register - Petugas', layout: 'layouts/petugas-layout', error: req.flash('error')});
    }
    else{
        res.redirect('/petugas');
    }
});

router.get('/ticket', async (req, res) => {
    if(!req.session.idPetugas){
        res.redirect('/petugas/login');
    }
    else{
        const tickets = await Ticket.find()
        res.render('petugas/ticket', {title: 'Ticket', layout: 'layouts/petugas-layout', tickets, error: req.flash('error')});
    }
});

router.get('/ticket/approved', async (req, res) => {
    if(!req.session.idPetugas){
        res.redirect('/petugas/login');
    }
    else{
        const tickets = await Ticket.find({idPetugas: req.session.idPetugas, status: 'Diterima'})
        res.render('petugas/aktif', {title: 'Ticket', layout: 'layouts/petugas-layout', tickets, error: req.flash('error')});
    }
});

router.get('/', (req, res) => {
    if(!req.session.idPetugas){
        res.redirect('/petugas/login');
    }
    else{
        res.render('petugas/home', {title: 'Home', layout: 'layouts/petugas-layout'});
    }
});

router.get('/chatroom/:idChatroom', async (req, res) => {
    if(!req.session.idPetugas){
        res.redirect('/petugas/login');
    }
    else{
        const chatroom = await Chatroom.findOne({idChatroom: req.params.idChatroom});
        res.render('petugas/chatroom', {title: 'Chatroom', layout: 'layouts/petugas-layout', chatroom});
    }
})

router.get('/ticket/:idTicket', async (req, res) => {
    if(!req.session.idPetugas){
        res.redirect('/petugas/login');
    }
    else{
        const ticket = await Ticket.findOne({idTicket: req.params.idTicket});
        res.render('petugas/detail', {title: 'Ticket', layout: 'layouts/petugas-layout', ticket, error: req.flash('error')});
    }
})

module.exports = router;