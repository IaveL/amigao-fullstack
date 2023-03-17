const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getToken = require("../helpers/get-token")
const createUserToken = require("../helpers/create-user-token");
module.exports = class UserController {
  static async register(req, res) {
    const { name, email, password, phone, confirmPassword } = req.body;

    //validacoes
    if (!name) {
      return res.status(400).json({ error: "O campo nome é obrigatório!" });
    }
    if (!email) {
      return res.status(400).json({ error: "O campo email é obrigatório!" });
    }
    if (!password) {
      return res.status(400).json({ error: "O campo senha é obrigatório!" });
    }
    if (!confirmPassword) {
      return res
        .status(400)
        .json({ error: "O campo confirmar senha é obrigatório!" });
    }
    if (!phone) {
      return res.status(400).json({ error: "O campo telefone é obrigatório!" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "As duas senhas precisam ser iguais." });
    }

    const userExists = await User.findOne({ email: email });

    if (userExists) {
      return res.status(400).json({ error: "Endereço de email ja utilizado." });
    }

    //criando hash da senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // criando usuario
    const user = new User({ name, email, phone, password: passwordHash });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "O campo email é obrigatório!" });
    }
    if (!password) {
      return res.status(400).json({ error: "O campo senha é obrigatório!" });
    }

    //checa se user existe
    const user = await User.findOne({ email: email });
    if (!user) {
    return res.status(422).json({ message: "Não há usuário cadastrado com este e-mail!" });
    }
    //checa se senha é a true
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        res.status(400).json({ message: "Senha ou email incorreto, favor verifique!" })
        return
    } 
    await createUserToken(user, req, res)
  }
  static async checkUser(req, res) {
    let currentUser

    if (req.headers.authorization) {
      // console.log(req.headers.authorization)
      //retorna o token (bearer)
      const token = getToken(req)
      const decoded = jwt.verify(token, 'umSecretExemplo')

      currentUser = await User.findById(decoded.id)
      console.log(`current user: ${currentUser}`)
      currentUser.password = undefined
    } else {
      currentUser = null
    }

    res.status(200).send(currentUser)

  }
};
