const winston = require('winston');

function handleErrorMsg(err, req, res, next) {
    //error  //warn   //info  //verbose   //debug   //silly
    winston.error(err.message, err);
    res.status(500).send('Something failed ' + err);
}

module.exports = handleErrorMsg;