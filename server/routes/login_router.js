// create express router
const express = require('express');
const router = express.Router()
const db = require('../database/index.js')
const tb_admin = db.admin
const tb_dokter = db.dokter
const tb_login = db.login
const Op = db.Sequelize.Op

var ironSession = require("iron-session/express").ironSession;
var session = ironSession({
  cookieName: "myapp_cookiename",
  // password: process.env.SECRET_COOKIE_PASSWORD,
  password: 'complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});
// create get request
// router.get('/', async (req, res) => {

//   try {
//     const admin = {
//       nik: 214280224,
//       nama: "aran",
//       role: 'admin'
//     }

//     // find if admin with nik exists
//     const admin_exist = await tb_admin.findByPk(admin.nik)

//     console.log(admin_exist);
//     // if admin exist
//     if (admin_exist) {
//       return res.status(400).send({status: false, message: `Admin dengan nik ${admin.nik} sudah ada`})
//     }

//     after_create_admin = await tb_admin.create(admin)


//     const login = {
//       username: 'kicap92',
//       password: '5c188ab394811451656f8c7f33680127',
//       role: 'admin',
//       id_admin: 214280224
//     }
//     await tb_login.create(login)

//     res.send({ status: true, message: "ini login get router" })
//   } catch (error) {
//     res.status(500).send({ status: false, message: error.message })
//   }


// })

// create get request
router.get('/', session, async (req, res) => {
  try {
    const username = req.query.username
    const password = req.query.password
    const role = req.query.role

    // console.log(username, password, role);
    let cek_login = await tb_login.findOne({
      where: {
        username: username,
        password: password,
        role: role
      }
    })

    // console.log(cek_login);
    if (!cek_login) {
      return res.status(400).send({ status: false, message: 'Username dan password salah' })
    }

    let cek_data;

    if (role == 'Admin') {
      cek_data = await tb_admin.findOne({
        where: {
          nik: cek_login.id_admin
        }
      })

    } else if (role == 'Dokter') {
      cek_data = await tb_dokter.findOne({
        where: {
          nik: cek_login.id_dokter
        }
      })
    }

    
    // add role to cek_data
    // cek_data.role = role;
    cek_data = cek_data.dataValues;
    // console.log(req.session.user);


    // session data
    req.session.user = {
      username: username,
      password: password,
      role: role,
      nik: cek_data.nik,
    };
    await req.session.save();



    res.send({ status: true, message: "ini login post router", data: cek_data })
  } catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
})

module.exports = router