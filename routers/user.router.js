const express = require('express')
const router = express.Router()

const { registerUser, getUser, updateUser, deleteUser, loginUser, getUserProfile,modifierPasswordApresConnexion , sendForgetPasswordEmail , updatePassword,imagePofile} = require('../controllers/user.controller')
const { userValidation } = require('../controllers/formValidation/sign-up.validation')
const { loginValidation } = require('../controllers/formValidation/sign-in.validation')
const auth = require('../middlewears/auth')
const multer = require('multer');
let upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'upload')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + req.user.id + '-' + file.originalname)
        }

    }),
    limits: {
        fileSize: 10000000
    },
    fileFilter: (req, file, cb) => {
        console.log(file);
        cb(null, true)
    }
})

router.get('/', getUser)
router.post('/sign-up', userValidation, registerUser)
router.put('/updateUser/:id', userValidation, updateUser)
router.delete('/deleteUser/:id', deleteUser)
router.post('/sign-in', loginValidation, loginUser)
router.get('/profil', auth, getUserProfile)
router.post('/forgot-password', sendForgetPasswordEmail)
router.put('/modifierMotDePasse', auth, modifierPasswordApresConnexion)
router.put('/reset-password/:token', updatePassword)
router.post('/profil/avatar', auth, upload.single('myFile'), imagePofile)


module.exports = router;