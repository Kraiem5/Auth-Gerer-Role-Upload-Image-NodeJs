const express = require('express')
const router = express.Router()

const { registerUser, getUser, updateUser, deleteUser, loginUser, getUserProfile,modifierPasswordApresConnexion , sendForgetPasswordEmail , updatePassword} = require('../controllers/user.controller')
const { userValidation } = require('../controllers/formValidation/sign-up.validation')
const { loginValidation } = require('../controllers/formValidation/sign-in.validation')
const auth = require('../middlewears/auth')

router.get('/', getUser)
router.post('/sign-up', userValidation, registerUser)
router.put('/updateUser/:id', userValidation, updateUser)
router.delete('/deleteUser', deleteUser)
router.post('/sign-in', loginValidation, loginUser)
router.get('/profil', auth, getUserProfile)
router.post('/reset-password', sendForgetPasswordEmail)
router.put('/modifierMotDePasse', auth, modifierPasswordApresConnexion)
router.put('/reset-password/:token', updatePassword)


module.exports = router;