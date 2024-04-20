const { check } = require("express-validator");

const userValidation = [
    check('nom').not().isEmpty().withMessage('nom obligataoire'),
    check('prenom').not().isEmpty().withMessage('prenom obligataoire'),
    check('email').not().isEmpty().withMessage('amail obligataoire').isEmail().withMessage('faux email'),
    check('password').not().isEmpty().withMessage('pass obligataoire').isLength({ min: 8 }).withMessage('minimum 8 caractere'),
    check('role').not().isEmpty().withMessage('role obligataoire'),
    check('cin').not().isEmpty().withMessage('cin obligataoire'),
]
const roleValidation = [
    check('name').not().isEmpty().withMessage('name obligataoire'),
    check('description').not().isEmpty().withMessage('description obligataoire'),
]
module.exports = { userValidation , roleValidation }