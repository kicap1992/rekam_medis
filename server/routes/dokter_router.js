const express = require('express');
const router = express.Router()
const db = require('../database/index.js')
const md5 = require('md5');
// const tb_admin = db.admin
const tb_dokter = db.dokter
const tb_login = db.login
const tb_pasien = db.pasien
const tb_tindakan = db.tindakan
const tb_obat = db.obat
const tb_jadwal_dokter = db.jadwal_dokter
const tb_rekam_medis = db.rekam_medis
const Op = db.Sequelize.Op
var _ = require('underscore');

const basicAuth = require('express-basic-auth');
const { obat } = require('../database/index.js');

const basicAuthMiddleware = basicAuth({
  users: { 'kicapkaran_admin': 'karan456_admin' },
  challenge: true,
  unauthorizedResponse: getUnauthenticatedResponse

})

function getUnauthenticatedResponse(req) {
  const { user } = req.auth?.user ?? {}
  return user ? `invalid credentials for user '${user}'` : 'no credentials provided';
}

router.get('/', basicAuthMiddleware, async (req, res) => {
  res.send({ status: true, message: 'connected to dokter' })
})

// create /jadwal_dokter get request
router.get('/jadwal_dokter', basicAuthMiddleware, async (req, res) => {
  try {
    id = req.query.id

    if (!id) {
      return res.status(400).send({ status: false, message: 'id tidak boleh kosong' })
    }

    const response = await tb_jadwal_dokter.findAll({
      where: {
        id_dokter: id
      }
    })

    res.send({ status: true, data: response })
  } catch (error) {
    res.send({ status: false, message: 'error' })
  }
})

// create /jadwal_dokter post request
router.post('/jadwal_dokter', basicAuthMiddleware, async (req, res) => {
  try {
    id = req.body.nik
    hari = req.body.hari
    jam_mulai = req.body.jam_mulai
    jam_selesai = req.body.jam_selesai

    if (!id || !hari || !jam_mulai || !jam_selesai) {
      return res.status(400).send({ status: false, message: 'id, hari, jam_mulai, jam_selesai tidak boleh kosong' })
    }

    const cek_jadwal = await tb_jadwal_dokter.findOne({
      where: {
        id_dokter: id,
        hari: hari
      }
    })

    if (cek_jadwal) {
      return res.status(400).send({ status: false, message: 'Jadwal sudah ada' })
    }



    const response = await tb_jadwal_dokter.create({
      id_dokter: id,
      hari: hari,
      jam_mulai: jam_mulai,
      jam_selesai: jam_selesai
    })

    res.send({ status: true, message: "Jadwal pada hari " + hari + " telah ditambahkan" })
  } catch (error) {
    res.send({ status: false, message: 'error' })
  }
})

// create /jadwal_dokter put request
router.put('/jadwal_dokter', basicAuthMiddleware, async (req, res) => {
  try {
    id = req.query.id
    hari = req.body.hari
    jam_mulai = req.body.jam_mulai
    jam_selesai = req.body.jam_selesai

    if (!id || !hari || !jam_mulai || !jam_selesai) {
      return res.status(400).send({ status: false, message: 'id, hari, jam_mulai, jam_selesai tidak boleh kosong' })
    }

    const cek_data = await tb_jadwal_dokter.findOne({
      where: {
        id_dokter: id,
        hari: hari
      }
    })

    if (!cek_data) {
      return res.status(400).send({ status: false, message: 'Jadwal tidak ditemukan' })
    }

    await tb_jadwal_dokter.update({
      id_dokter: id,
      hari: hari,
      jam_mulai: jam_mulai,
      jam_selesai: jam_selesai
    }, {
      where: {
        hari: hari,
      }
    })
    // console.log(id , hari, jam_mulai, jam_selesai, "ini id hari jam_mulai jam_selesai")

    res.send({ status: true, message: `Jadwal pada hari ${hari} telah diubah` })
  } catch (error) {
    res.send({ status: false, message: 'error' })
  }
})

// create /jadwal_dokter delete request
router.delete('/jadwal_dokter', basicAuthMiddleware, async (req, res) => {
  try {
    id = req.query.id
    hari = req.body.hari

    if (!id || !hari) {
      return res.status(400).send({ status: false, message: 'id, hari tidak boleh kosong' })
    }

    const cek_data = await tb_jadwal_dokter.findOne({
      where: {
        id_dokter: id,
        hari: hari
      }
    })

    if (!cek_data) {
      return res.status(400).send({ status: false, message: 'Jadwal tidak ditemukan' })
    }

    await tb_jadwal_dokter.destroy({
      where: {
        id_dokter: id,
        hari: hari,
      }
    })

    res.send({ status: true, message: `Jadwal pada hari ${hari} telah dihapus` })
  } catch (error) {
    res.send({ status: false, message: 'error' })
  }
})

// create /jadwal_ini_hari get request
router.get('/jadwal_ini_hari', basicAuthMiddleware, async (req, res) => {
  try {
    id = req.query.id
    let today_date = new Date();
    let dd = today_date.getDate();
    let mm = today_date.getMonth() + 1;
    let yyyy = today_date.getFullYear();
    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;
    let today_date_format = yyyy + '-' + mm + '-' + dd;

    if (!id) {
      return res.status(400).send({ status: false, message: 'id tidak boleh kosong' })
    }
    // console.log(today_date_format , "ini today_date_format");
    const response = await tb_rekam_medis.findAll({
      where: {
        id_dokter: id,
        tanggal_periksa: today_date_format
      },
      include: [
        {
          model: tb_pasien,
        }
      ]
    })
    // console.log(response , "ini response");

    // res.send({ status: true, data: "ini rekam medis" })
    res.send({ status: true, data: response })
  } catch (error) {
    res.send({ status: false, message: 'error' })
  }
})

// create /cek_data_rekam_medis get request
router.get('/cek_data_rekam_medis', basicAuthMiddleware, async (req, res) => {
  try {
    id = req.query.id
    id_dokter = req.query.id_dokter
    if (!id) {
      return res.status(400).send({ status: false, message: 'id tidak boleh kosong' })
    }
    if (!id_dokter) {
      return res.status(400).send({ status: false, message: 'id_dokter tidak boleh kosong' })
    }

    const response = await tb_rekam_medis.findOne({
      where: {
        id_rekam_medis: id,
        id_dokter: id_dokter
      },
      include: [
        {
          model: tb_pasien,
        },
        {
          model: tb_dokter,
        }
      ]
    })

    res.send({ status: true, data: response })
  } catch (error) {
    res.status(500).send({ status: false, message: 'error' })
  }
})

// create /cek_obat get request
router.get('/cek_obat', basicAuthMiddleware, async (req, res) => {
  try {
    id = req.query.id
    if (!id) {
      return res.status(400).send({ status: false, message: 'id tidak boleh kosong' })
    }

    const response = await tb_obat.findOne({
      where: {
        id_obat: id
      }
    })

    res.send({ status: true, data: response })
  } catch (error) {
    res.status(500).send({ status: false, message: 'error' })
  }
})

// create /rekam_medis_update put request
router.put('/rekam_medis_update', basicAuthMiddleware, async (req, res) => {
  try {
    let id = req.query.id_rekam_medis
    let id_dokter = req.query.id_dokter
    let keluhan = req.body.keluhan
    let diagnosa = req.body.diagnosa
    let keterangan = req.body.keterangan
    let obat = req.body.obat
    let tindakan = req.body.tindakan

    if (!id) {
      return res.status(400).send({ status: false, message: 'id tidak boleh kosong' })
    }
    if (!id_dokter) {
      return res.status(400).send({ status: false, message: 'id_dokter tidak boleh kosong' })
    }

    if (!keluhan && !diagnosa && !keterangan && !obat && !tindakan) {
      return res.status(400).send({ status: false, message: 'keluhan, diagnosa, keterangan, obat, tindakan tidak boleh kosong' })
    }

    await tb_rekam_medis.update(
      {
        keluhan: keluhan,
        diagnosa: diagnosa,
        keterangan: keterangan,
        obat: JSON.stringify(obat),
        tindakan: JSON.stringify(tindakan)
      },
      {
        where: {
          id_rekam_medis: id,
          id_dokter: id_dokter
        }
      }
    )

    res.status(200).send({ status: true, message: 'data berhasil diupdate' })

  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: 'error' })
  }
})

// create /cari_rekam_medis get request
router.get('/cari_rekam_medis', basicAuthMiddleware, async (req, res) => {
  try {
    data1 = req.query.data
    data2 = req.query.data2
    id_dokter = req.query.id_dokter
    if (!data1 && !data2 && !id_dokter) {
      return res.status(400).send({ status: false, message: 'data tidak boleh kosong' })
    }

    const response = await tb_rekam_medis.findAll({
      where: {
        id_dokter: id_dokter,
      },
      include: [
        {
          model: tb_pasien,
          where: {
            [Op.or]: [
              {
                nama: {
                  [Op.or]: [
                    { [Op.like]: '%' + data1 + '%' },
                    { [Op.like]: '%' + data2 + '%' }
                  ]
                }
              },
              {
                nik:{
                  [Op.or]: [
                    { [Op.like]: '%' + data1 + '%' },
                    { [Op.like]: '%' + data2 + '%' }
                  ]
                }
              }
            ]
          }
        }
      ]
    })

    res.status(200).send({ status: true, data: response })
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: 'error' })
  }
})

// create /tindakan get request
router.get('/tindakan', basicAuthMiddleware, async (req, res) => {
  try {
    id = req.query.id
    if (!id) {
      return res.status(400).send({ status: false, message: 'id tidak boleh kosong' })
    }
    
    const response = await tb_tindakan.findOne({
      where: {
        id_tindakan: id
      }
    })

    // console.log(response, " ini tindakannya");
    res.send({ status: true, data: response })
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: false, message: 'error' })
  }
})

module.exports = router