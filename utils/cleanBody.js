const sanitize = require('mongo-sanitize');

module.exports = (req, res, next) => {
    try {
        const domain = "@unikadelasalle.ac.id"
        if(req.body.email){
            req.body.email = req.body.email + domain;
        }
        req.body = sanitize(req.body);
        next();
    } catch (error) {
        console.log('clean-body-error', error);
        return res.status(500).json({
            error: true,
            message: "Couldn't sanitize the body"
        });
    };
}