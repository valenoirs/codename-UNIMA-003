const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

// Import Models
const Ticket = require('../models/ticket');
const Chatroom = require('../models/chatroom');
const User = require('../models/user');

// Post
router.post('/login', UserController.Login);
router.post('/register', UserController.Register);

router.put('/', UserController.Edit);

// Logout
router.get('/logout', UserController.Logout);

// Get
router.get('/login', (req, res) => {
    if(!req.session.idUser){
        res.render('user/login', {title: 'Login', layout: 'layouts/user-layout', error: req.flash('error')});
    }
    else{
        res.redirect('/');
    }
});

router.get('/register', (req, res) => {
    if(!req.session.idUser){
        res.render('user/register', {title: 'Register', layout: 'layouts/user-layout', error: req.flash('error')});
    }
    else{
        res.redirect('/');
    }
});

router.get('/ticket', async (req, res) => {
    if(!req.session.idUser){
        res.redirect('/login');
    }
    else{
        const tickets = await Ticket.find({idUser: req.session.idUser});
        const user = await User.findOne({idUser: req.session.idUser});
        res.render('user/ticket', {title: 'Ticket', layout: 'layouts/user-layout', tickets, user, error: req.flash('error')});
    }
})

router.get('/submit', async (req, res) => {
    if(!req.session.idUser){
        res.redirect('/login');
    }
    else{
        const user = await User.findOne({idUser: req.session.idUser});
        res.render('user/submit', {title: 'Submit', layout: 'layouts/user-layout', user, error: req.flash('error')});
    }
})

router.get('/profile/edit', async (req, res) => {
    if(!req.session.idUser){
        res.redirect('/login');
    }
    else{
        const user = await User.findOne({idUser: req.session.idUser});
        res.render('user/edit', {title: 'Edit', layout: 'layouts/user-layout', user, error: req.flash('error')});
    }
})

router.get('/', async (req, res) => {
    if(!req.session.idUser){
        res.redirect('/login');
    }
    else{
        const user = await User.findOne({idUser: req.session.idUser});
        res.render('user/home',  {title: 'Home', layout: 'layouts/user-layout', user});
    }
})

router.get('/chatroom/:idChatroom', async (req, res) => {
    if(!req.session.idUser){
        res.redirect('/login');
    }
    else{
        const chatroom = await Chatroom.findOne({idChatroom: req.params.idChatroom});
        const user = await User.findOne({idUser: req.session.idUser});
        res.render('user/chatroom', {title: 'Chatroom', layout: 'layouts/user-layout', chatroom, user});
    }
})

router.get('/ticket/:idTicket', async (req, res) => {
    if(!req.session.idUser){
        res.redirect('/login');
    }
    else{
        const ticket = await Ticket.findOne({idTicket: req.params.idTicket});
        const user = await User.findOne({idUser: req.session.idUser});
        res.render('user/detail', {title: 'Ticket', layout: 'layouts/user-layout', ticket, user, error: req.flash('error')});
    }
})

module.exports = router;