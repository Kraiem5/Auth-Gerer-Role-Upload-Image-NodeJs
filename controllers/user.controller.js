const userModel = require("../models/user.model")
const { validationResult } = require('express-validator')
const { sendEmailToUser } = require("../utils/sendMailPasswordUser")
const jwt = require('jsonwebtoken')
require("dotenv").config()
const bcrypt = require('bcryptjs'); // Ajout de bcrypt pour la comparaison de mot de passe
const { generateToken, verifToken } = require('../utils/generateToken');
const mailer = require('../utils/sendPasswordRecoveryMail');



const registerUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ errors: errors.array({ onlyFirstError: true }) })
    }

    const { nom, prenom, email, password, role, cin, telephone } = req.body

    try {
        let user = await userModel.findOne({ email: email })
        if (user) {
            return res.json({ msg: "utilisateur déjà exist" })
        }

        const newUser = new userModel({
            nom, prenom, email, password, role, cin, telephone
        })
        await newUser.save()
        await sendEmailToUser(email, password)
        res.status(200).send({ msg: "utilisateur ajouté avec succès" })
    } catch (error) {
        res.status(400).send({ status: false })
    }
    
}
const getUser = async (req, res) => {
    try {
        const user = await userModel.find(req.user)
        res.json(user)
    } catch (error) {
        res.status(400).send({ msg: "erreur de serveur!" })
    }
}
const updateUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id)
        if (user) {
            if ('password' in req.body) {
                // Si le champ password est présent, le supprimer pour éviter les modifications non autorisées
                delete req.body.password;
            }
            const result = await userModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).select('-password')
            res.json({ status: true, result: result })
        }
    } catch (error) {
        res.status(400).json({ status: false, msg: 'User not found' });
    }
}
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User non trouvé' });
        }
        res.status(200).json({ message: 'User supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la suppression du rôle' });
    }
}
const loginUser = async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ errors: errors.array({ onlyFirstError: true }) })
    }

    const { email, password } = req.body
    try {
        const user = await userModel.findOne({ email }).populate('role')
        console.log(user);
        if (!user) {
            return res.status(400).json({
                errors: [{ msg: 'Cannot find user with those credentials!' }]
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                errors: [{ msg: 'Cannot find user with those credentials!' }]
            })
        }
        const payload = {
            user: {
                id: user._id,
                role: user.role.name
            }
        }
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }, (error, token) => {
            if (error) throw error
            res.json({ token: token, admin: user.role.name === "Admin" ? true : false })
            console.log("true");
        })

    } catch (error) {
        console.error('fff', error.message)
        res.json({ msg: 'Erreur de serveur!' })
    }
}
const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (user) {
            return res.json({
                status: true,
                result: user
            })
        }
        else {
            res.status(404).send({
                status: false,
                msg: 'user not found'
            })
        }
    } catch (error) {
        res.json({ msg: 'Erreur de serveur!' })
    }
}
const sendForgetPasswordEmail = async (req, res) => {
    const email = req.body['email']
    try {
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(400).json({
                errors: [{ msg: 'Cannot find user with those credentials!' }]
            })
        }
        const payload = {
            user: {
                id: user._id
            }
        }
        const token = generateToken(payload)
        console.log(token);
        mailer.send("resetCode", req.body['email'], "reset your password", token);
        res.status(200).json({ msg: 'Email sent!' })
    } catch (error) {
        console.error('fff', error.message)
        res.json({ msg: 'Erreuur de serveur!' })
    }
}
const updatePassword = async (req, res) => {
    try {
        const verif = await verifToken(req.params.token)
        if (!verif) {
            return res.status(400).json({
                status: false, message: 'Invalid Token !'
            })
        }
        const user = await userModel.findOne({ _id: verif.user.id })
        if (!user) {
            return res.status(400).json({
                status: false, message: 'Cannot find user with those credentials!'
            })
        }
        const salt = await bcrypt.genSalt(12)
        const newpassword = await bcrypt.hash(req.body.password, salt)
        const result = await userModel.findByIdAndUpdate(verif.user.id, { $set: { password: newpassword } })
            .select('-password')
        res.send({ status: true, message: 'passoword updated successfully' })
    } catch (error) {
        console.log(error)
    }
}
const modifierPasswordApresConnexion = async (req, res) => {
    try {
        const { ancienMotDePasse, nouveauMotDePasse } = req.body;
        const userId = req.user.id;
        // Vérification de l'ancien mot de passe
        const utilisateur = await userModel.findById(userId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        const motDePasseValide = await bcrypt.compare(ancienMotDePasse, utilisateur.password);
        if (!motDePasseValide) {
            return res.status(400).json({ message: 'Ancien mot de passe incorrect.' });
        }
        // Mise à jour du mot de passe de l'utilisateur
        utilisateur.password = nouveauMotDePasse;
        await utilisateur.save();
        res.status(200).json({ message: 'Mot de passe modifié avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la modification du mot de passe.' });
    }
}
const imagePofile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (user) {
            const result = await userModel.findByIdAndUpdate(req.user.id, { $set: { avatar: req.file.filename } })
                .select('-password')
            res.json({
                status: true,
                result: result
            })
        } else {
            res.status(404).json({
                succes: false,
                msg: 'user not found'
            })
        }
    } catch (error) {
        console.log("update profile", error)
    }
}
module.exports = {
    registerUser,
    getUser,
    updateUser,
    deleteUser,
    loginUser,
    getUserProfile,
    sendForgetPasswordEmail,
    updatePassword,
    modifierPasswordApresConnexion,
    imagePofile
}