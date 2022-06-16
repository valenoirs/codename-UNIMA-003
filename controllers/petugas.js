// Requiring module, packages, etc.
const Joi = require('joi');
const {v4: uuidv4} = require('uuid')

const comparePassword = require('../utils/comparePassword');

// Import Model
const Petugas = require('../models/petugas');

// Validate Petugas
const PetugasSchema = Joi.object().keys({
    name: Joi.string().required(),
    gender: Joi.string().required(),
    birth: Joi.date().required(),
    email: Joi.string().email({minDomainSegments: 2}).required(),
    password: Joi.string().required().min(8),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

module.exports.Register = async (req, res, next) => {
    try {
        const petugas = await Petugas.findOne({email: req.body.email});
        
        if(petugas){
            console.log('Petugas with same email found!');
            req.flash('error', 'Email sudah terdaftar!');
            return res.redirect('/petugas/pengaduan/kominfo/tomohon/register');
        }

        if(req.body.password.length < 8){
            console.log('Password length less than 8 characters!')
            req.flash('error', 'Password terlalu singkat!');
            return res.redirect('/petugas/pengaduan/kominfo/tomohon/register');
        }

        if(req.body.password !== req.body.confirmPassword){
            console.log('Password validation error!')
            req.flash('error', 'Konfirmasi password salah!');
            return res.redirect('/petugas/pengaduan/kominfo/tomohon/register');
        }

        delete req.body.confirmPassword;

        req.body.idPetugas = uuidv4();

        const newPetugas = new Petugas(req.body);
        await newPetugas.save();

        console.log(newPetugas);
        console.log('Petugas added!');

        return res.redirect('/petugas/login');

    }
    catch (error) {
        console.error('register-error', error);
        req.session.error = "Register Error";
        return res.redirect('/petugas/pengaduan/kominfo/tomohon/register');
    }
};

exports.Login = async (req, res, next) => {
    try {
        // Find petugas
        const petugas = await Petugas.findOne({email: req.body.email});

        // Petugas validation
        if(!petugas){
            console.log('Petugas not found!');
            req.flash('error', 'Email tidak ditemukan!');
            return res.redirect('/petugas/login');
        }

        // Password validation
        passwordValid = comparePassword(req.body.password, petugas.password);

        if(!passwordValid){
            console.log('Password invalid!');
            req.flash('error', 'Password salah!');
            return res.redirect('/petugas/login');
        }

        // Success
        req.session.idPetugas = petugas.idPetugas;
        req.session.namaPetugas = petugas.nama;

        console.log('Logged in!');
        return res.redirect('/petugas');
    }
    catch (error) {
        console.error('login-error', error);
        req.session.error = "Login Error";
        return res.redirect('/petugas/login');
    }
};

exports.Logout = async (req, res, next) => {
    try{
        delete req.session.idPetugas;
        delete req.session.namaPetugas;

        console.log('Petugas logged out!')
        return res.redirect('/petugas/login');
    }
    catch (error){
        console.error('logout-error', error);
        return res.redirect('/petugas/login');
    }
};