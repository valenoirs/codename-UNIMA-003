// Requiring module, packages, etc.
const Joi = require('joi');
const {v4: uuidv4} = require('uuid')

const comparePassword = require('../utils/comparePassword');

// Import Model
const User = require('../models/user');

// Validate User
const userSchema = Joi.object().keys({
    name: Joi.string().required(),
    gender: Joi.string().required(),
    birth: Joi.date().required(),
    email: Joi.string().email({minDomainSegments: 2}).required(),
    password: Joi.string().required().min(8),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

module.exports.Register = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        
        if(user){
            console.log('User with same email found!');
            req.flash('error', 'Email telah terdaftar!');
            return res.redirect('/register');
        }

        if(req.body.password.length < 8){
            console.log('Password length less than 8 characters!')
            req.flash('error', 'Password terlalu singkat!');
            return res.redirect('/register');
        }

        if(req.body.password !== req.body.confirmPassword){
            console.log('Password validation error!')
            req.flash('error', 'Konfirmasi password salah!');
            return res.redirect('/register');
        }

        delete req.body.confirmPassword;

        req.body.idUser = uuidv4();

        const newUser = new User(req.body);
        await newUser.save();

        console.log(newUser);
        console.log('User added!');

        return res.redirect('/login');

    }
    catch (error) {
        console.error('register-error', error);
        req.session.error = "Register Error";
        return res.redirect('/register');
    }
};

exports.Login = async (req, res, next) => {
    try {
        // Find user
        const user = await User.findOne({email: req.body.email});

        // User validation
        if(!user){
            console.log('User not found!');
            req.flash('error', 'Email tidak ditemukan!');
            // req.session.error = 'Email salah!';
            return res.redirect('/login');
        }

        // Password validation
        passwordValid = comparePassword(req.body.password, user.password);

        if(!passwordValid){
            console.log('Password invalid!');
            req.flash('error', 'Password salah!');
            return res.redirect('/login');
        }

        // Success
        req.session.idUser = user.idUser;
        req.session.namaUser = user.nama;

        console.log('Logged in!');
        return res.redirect('/');
    }
    catch (error) {
        console.error('login-error', error);
        req.flash('error', 'Login Error!');
        return res.redirect('/login');
    }
};

exports.Edit = async (req, res, next) => {
    console.log(req.body);
    try {
        const user = await User.findOne({email: req.body.email});

        const passwordValid = comparePassword(req.body.password, user.password);

        if(!passwordValid){
            console.log('Password invalid!')
            req.flash('error', 'Password yang anda masukkan salah!');
            return res.redirect('/profile/edit');
        }

        if(req.body.newPassword){
            if(req.body.newPassword.length < 8){
                console.log('Password length less than 8 characters!')
                req.flash('error', 'Password terlalu singkat!');
                return res.redirect('/profile/edit');
            }
    
            if(req.body.newPassword !== req.body.confirmPassword){
                console.log('Password validation error!')
                req.flash('error', 'Konfirmasi password salah!');
                return res.redirect('/profile/edit');
            }

            const hash = await hashPassword(req.body.newPassword);
            
            delete req.body.confirmPassword;

            await User.updateOne({email: req.body.email}, {
                $set: {
                    password: hash
                }
            })
        }

        await User.updateOne({email: req.body.email}, {
            $set: {
                name: req.body.name,
                gender: req.body.gender,
                birth: req.body.birth,
            }
        })

        console.log('User Edited!');
        return res.redirect('/');

    }
    catch (error) {
        console.error('edit-error', error);
        req.session.error = "Edit profile Error";
        return res.redirect('/profile/edit');
    }
};

exports.Logout = async (req, res, next) => {
    try{
        delete req.session.idUser;
        delete req.session.namaUser;

        return res.redirect('/login');
    }
    catch (error){
        console.error('logout-error', error);
        return res.redirect('/');
    }
};