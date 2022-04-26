const express = require('express');
const router = express.Router()
const db = require('../database/index.js')
const tb_admin = db.admin
const tb_dokter = db.dokter
// const tb_login = db.login
const tb_tindakan = db.tindakan
const tb_obat = db.obat
const Op = db.Sequelize.Op

const app = require('express')()
const basicAuth = require('express-basic-auth')

const basicAuthMiddleware = basicAuth({
  users: { 'kicapkaran_admin': 'karan456_admin' },
  challenge: true,
  unauthorizedResponse: getUnauthenticatedResponse

})

function getUnauthenticatedResponse(req) {
  const { user } = req.auth?.user ?? {}
  return user ? `invalid credentials for user '${user}'` : 'no credentials provided';
}


// create / get request
router.get('/', basicAuthMiddleware, async (req, res) => {
  res.send({ status: true, message: 'connected to admin' })
})

// create /tindakan post request
router.post('/tindakan', basicAuthMiddleware, async (req, res) => {
  console.log("sini untuk tambah tindakan")
  try {
    const tindakan = req.body.tindakan
    let cek_tindakan = await tb_tindakan.findOne({
      where: {
        nama_tindakan: tindakan
      }
    })

    // if()

    if (cek_tindakan) {
      return res.status(400).send({ status: false, message: `Tindakan ${tindakan} sudah ada` })
    }

    // create tindakan
    const new_tindakan = await tb_tindakan.create({
      nama_tindakan: tindakan
    })

    res.status(200).send({ status: true, message: `Tindakan ${tindakan} berhasil ditambahkan` })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }

})

// create /tindaakan get request
router.get('/tindakan', basicAuthMiddleware, async (req, res) => {
  console.log("sini untuk tindakan get")
  try {
    console.log("ambil all tinakan")
    let tindakan = await tb_tindakan.findAll()
    res.status(200).send({ status: true, data: tindakan })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})

// create /tindakan delete request
router.delete('/tindakan', basicAuthMiddleware, async (req, res) => {
  console.log("sini untuk tindakan delete")
  try {
    const id = req.query.id
    // console.log(id, "ini idnya di delete")
    let tindakan = await tb_tindakan.findOne({
      where: {
        id_tindakan: id
      }
    })

    if (!tindakan) {
      return res.status(400).send({ status: false, message: `Tindakan dengan id ${id} tidak ditemukan` })
    }

    await tindakan.destroy()

    res.status(200).send({ status: true, message: `Tindakan dengan id ${id} berhasil dihapus` })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})

// create /obat post request
router.post('/obat', basicAuthMiddleware, async (req, res) => {
  console.log("sini untuk obat post")
  try {
    const obat = req.body.obat
    let cek_obat = await tb_obat.findOne({
      where: {
        nama_obat: obat
      }
    })

    if (cek_obat) {
      return res.status(400).send({ status: false, message: `Obat ${obat} sudah ada` })
    }

    // create obat
    const new_obat = await tb_obat.create({
      nama_obat: obat,
      jenis: req.body.jenis,
      jumlah: req.body.jumlah,
      harga: req.body.harga,
      history: JSON.stringify(req.body.history)
    })

    res.status(200).send({ status: true, message: `Obat ${obat} berhasil ditambahkan` })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})

// create /obat get request
router.get('/obat', basicAuthMiddleware, async (req, res) => {
  // console.log("sini untuk obat get")
  try {
    let id = req.query.id
    // if id is not null
    if (id) {
      let obat = await tb_obat.findOne({
        where: {
          id_obat: id
        }
      })

      if (!obat) {
        return res.status(400).send({ status: false, message: `Obat dengan id ${id} tidak ditemukan` })
      }

      obat = JSON.parse(obat.dataValues.history)

      res.status(200).send({ status: true, data: obat})
    } else {
      // console.log("ambil all obat")
      let obat = await tb_obat.findAll()
      res.status(200).send({ status: true, data: obat })
    }

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})

// create /obat put request
router.put('/obat', basicAuthMiddleware, async (req, res) => {
  console.log("sini untuk obat put")
  try {
    const id = req.query.id
    const detail = req.query.detail
    let obat = await tb_obat.findOne({
      where: {
        id_obat: id
      }
    })

    if (!obat) {
      return res.status(400).send({ status: false, message: `Obat dengan id ${id} tidak ditemukan` })
    }

    if (!detail || detail != "edit_data") {
      return res.status(400).send({ status: false, message: `Detail Tidak Diketahui` })
    }

    // get the history from obat

    let history = JSON.parse(obat.dataValues.history)
    // add the req.body.history to the history
    history.push(req.body.history)
    // console.log(history)

    await obat.update({
      nama_obat: req.body.obat,
      jenis: req.body.jenis,
      jumlah: req.body.jumlah,
      harga: req.body.harga,
      history: JSON.stringify(history)
    })

    res.status(200).send({ status: true, message: `Obat dengan id ${id} berhasil diupdate` })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})



module.exports = router