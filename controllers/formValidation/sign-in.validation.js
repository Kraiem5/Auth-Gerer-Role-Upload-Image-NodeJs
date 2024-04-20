const {check} =require("express-validator");

const loginValidation = [
 
    check('email').not().isEmpty().withMessage('email obligataoire'),
    check('password').not().isEmpty().withMessage('pass obligataoire'),
]

module.exports = { loginValidation }