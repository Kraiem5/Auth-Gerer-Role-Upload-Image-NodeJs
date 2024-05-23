
const roleModel = require('../models/role.model')

const registerRole = async (req, res) => {
    const { name, description } = req.body
    try {

        let role = await roleModel.findOne({ name: name })
        if (role) {
            return res.json({ msg: "role déjà exist" })
        }
        const newRole = new roleModel({ name, description })
        await newRole.save()
        res.status(200).json({ msg: 'Rôle ajouté avec succès' })
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du rôle' });
    }
}

const getRole = async (req, res) => {
    try {
        const role = await roleModel.find()
        console.log("aaa",role);
        return res.json(role)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la récupération des rôles' });
    }
}

const updateRole = async (req, res) => {
    try {
        const role = await roleModel.findById(req.params.id)
        if (role) {
            const result = await roleModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
            return res.status(200).json({ message: 'Rôle modifié avec succès', data: result });
        }
        return res.status(404).json({ message: 'Rôle non trouvé' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erreur lors de la modification du rôle' });
    }
}

const deleteRole = async (req, res) => {
    try {
        const role = await roleModel.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }
        res.status(200).json({ message: 'Rôle supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la suppression du rôle' });
    }
}
module.exports = { registerRole, getRole, updateRole, deleteRole }