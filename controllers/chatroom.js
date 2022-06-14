// Import Models
const Chatroom = require('../models/chatroom');

module.exports.Send = async (req, res, next) => {
    try{
        const chatroom = await Chatroom.updateOne({idChatroom: req.body.idChatroom}, {
            $push: {
                pesan: req.body
            }
        })

        console.log('Message sent!');
        return res.redirect('back');
    }
    catch(error){
        console.error('sending-message-error', error);
        req.flash('error', 'Gagal mengirimkan pesan - unknown error');
        return res.redirect('back');
    }
}