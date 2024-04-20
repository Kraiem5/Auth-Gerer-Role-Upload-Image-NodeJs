const express = require('express')
const router = express.Router()

const { registerRole, getRole, updateRole, deleteRole } = require('../controllers/role.controller')
const { roleValidation } = require('../controllers/formValidation/sign-up.validation')
router.post('/ajouterRole',roleValidation, registerRole)
router.get('/getAll', getRole)
router.put('/updateRole/:id',roleValidation, updateRole)
router.delete('/deleteRole/:id', deleteRole)


module.exports = router;