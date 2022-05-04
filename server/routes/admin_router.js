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

// const app = require('express')()
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

// create /tindakan put request
router.put('/tindakan', basicAuthMiddleware, async (req, res) => {
  try{
    const id = req.query.id
    const tindakan = req.body.tindakan
    if (!id) {
      return res.status(400).send({ status: false, message: `id tidak boleh kosong` })
    }

    let cek_tindakan = await tb_tindakan.findOne({
      where: {
        id_tindakan: id
      }
    })

    if (!cek_tindakan) {
      return res.status(400).send({ status: false, message: `Tindakan dengan id ${id} tidak ditemukan` })
    }

    await cek_tindakan.update({
      nama_tindakan: tindakan
    })

    res.status(200).send({ status: true, message: `Tindakan dengan id ${id} berhasil diubah` })

  }catch(err){
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

      res.status(200).send({ status: true, data: obat })
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


// create /dokter post request
router.post('/dokter', basicAuthMiddleware, async (req, res) => {
  console.log("sini untuk dokter post")
  try {
    const nik = req.body.nik
    let cek_dokter = await tb_dokter.findOne({
      where: {
        nik: nik
      }
    })

    if (cek_dokter) {
      return res.status(400).send({ status: false, message: `Dokter dengan NIK ${nik} sudah ada`, data: [cek_dokter.dataValues] })
    }


    // create dokter
    const new_dokter = await tb_dokter.create({
      nik: nik,
      nama: req.body.nama,
      alamat: req.body.alamat,
      no_telp: req.body.no_telp,
      status: "Aktif",
      spesialis: req.body.spesialis,
    })

    await tb_login.create({
      username: nik,
      password: md5(nik),
      role: "dokter",
      id_dokter: nik
    })

    const jadwals = req.body.jadwal
    // console.log(jadwal)
    // loop the jadwal
    for (let jadwal of jadwals) {
      // console.log(jadwal)
      await tb_jadwal_dokter.create({
        id_dokter: nik,
        hari: jadwal,
        jam_mulai: req.body.jam_mulai,
        jam_selesai: req.body.jam_selesai
      })
    }


    res.status(200).send({ status: true, message: `Dokter ${req.body.nama} berhasil ditambahkan` })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})


// create /dokter get request
router.get('/dokter', basicAuthMiddleware, async (req, res) => {
  console.log("sini untuk dokter get")
  try {
    let nik = req.query.nik
    // if id is not null
    if (nik) {
      let dokter = await tb_dokter.findOne({
        where: {
          nik: nik
        }
      })

      if (!dokter) {
        return res.status(400).send({ status: false, message: `Dokter dengan NIK ${nik} tidak ditemukan` })
      }

      let data
      if (req.query.detail == "jadwal") {
        data = await tb_jadwal_dokter.findAll({
          where: {
            id_dokter: nik
          }
        })

      } else {
        data = dokter.dataValues
      }

      res.status(200).send({ status: true, data: data })
    } else {
      // console.log("ambil all dokter")
      let dokter = await tb_dokter.findAll()
      res.status(200).send({ status: true, data: dokter })
    }

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})


// create /dokter put request
router.put('/dokter', basicAuthMiddleware, async (req, res) => {
  console.log("sini untuk dokter put")
  try {
    const nik = req.query.nik
    const detail = req.query.detail
    let dokter = await tb_dokter.findOne({
      where: {
        nik: nik
      }
    })

    if (!dokter) {
      return res.status(400).send({ status: false, message: `Dokter dengan NIK ${nik} tidak ditemukan` })
    }

    if (!detail || detail != "datanya") {
      return res.status(400).send({ status: false, message: `Detail Tidak Diketahui` })
    }

    let message
    if (detail == 'datanya') {
      await dokter.update({
        nama: req.body.nama,
        alamat: req.body.alamat,
        no_telp: req.body.no_telp,
        spesialis: req.body.spesialis,
      })
      message = `Detail Dokter dengan ${nik} berhasil diedit`
    }


    res.status(200).send({ status: true, message: message })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})

// create /cek_jadwal get request
router.get('/cek_jadwal', basicAuthMiddleware, async (req, res) => {
  console.log("sini untuk cek_jadwal get")
  try {
    const hari = req.query.hari
    const jam = req.query.jam

    if (!hari || !jam) {
      return res.status(400).send({ status: false, message: `Hari dan Jam tidak diketahui` })
    }

    let jadwal = await tb_jadwal_dokter.findAll({
      where: {
        hari: hari,
        jam_mulai: {
          [Op.lte]: jam
        },
        jam_selesai: {
          [Op.gte]: jam
        }
      },
      include: {
        model: tb_dokter,
        attributes: ['nama', 'spesialis']
      }
    })
    console.log(hari)
    console.log(jam)
    // cek if jadwal is empty
    if (jadwal.length == 0) {
      return res.status(400).send({ status: false, message: `Tidak ada jadwal pada hari ${hari} pada jam ${jam}`, data: [] })
    }

    console.log(jadwal, "ini jadwalnya")


    res.status(200).send({ status: true, data: jadwal })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})

// create /pasien post request
router.post('/pasien', basicAuthMiddleware, async (req, res) => {
  console.log("sini untuk pasien post")
  try {
    const nik = req.body.nik
    const nama = req.body.nama
    const jenis_kelamin = req.body.jenis_kelamin
    const tgl_lahir = req.body.tgl_lahir
    const alamat = req.body.alamat
    const pekerjaan = req.body.pekerjaan
    const golongan_darah = req.body.golongan_darah
    const pendidikan = req.body.pendidikan
    const no_telp = req.body.no_telp
    const status_pernikahan = req.body.status_pernikahan
    const nama_orang_tua_wali = req.body.nama_orang_tua_wali
    const nama_pasangan = req.body.nama_pasangan

    if (!nik || !nama || !jenis_kelamin || !tgl_lahir || !alamat || !pekerjaan || !golongan_darah || !pendidikan || !no_telp || !status_pernikahan || !nama_orang_tua_wali || !nama_pasangan) {
      return res.status(400).send({ status: false, message: `Data tidak lengkap` })
    }

    let pasien = await tb_pasien.findOne({
      where: {
        nik: nik
      }
    })

    if (pasien) {
      return res.status(400).send({ status: false, message: `Pasien dengan NIK ${nik} sudah terdaftar`, data: [pasien.dataValues] })
    }

    let tanggal_periksa = req.body.tanggal_periksa
    let id_dokter = req.body.id_dokter
    let jam_periksa = req.body.jam_periksa

    let data_all = req.body
    let data_pasien, data_jadwal
    // remove tanggal_periksa,  id_dokter, jam_periksa from req.body
    data_pasien = _.omit(data_all, ['tanggal_periksa', 'id_dokter', 'jam_periksa'])
    data_jadwal = _.omit(data_all, ['nik', 'nama', 'jenis_kelamin', 'tgl_lahir', 'alamat', 'pekerjaan', 'golongan_darah', 'pendidikan', 'no_telp', 'status_pernikahan', 'nama_orang_tua_wali', 'nama_pasangan'])


    let new_pasien = await tb_pasien.create(data_pasien)
    // add pasien nik to data_jadwal
    data_jadwal.id_pasien = new_pasien.nik

    await tb_rekam_medis.create(data_jadwal)
    // console.log(data_pasien, "ini data pasien")
    // console.log(data_jadwal, "ini data jadwal")

    res.status(200).send({ status: true, message: `Pasien dengan NIK ${nik} berhasil ditambahkan\nDan tanggal pemeriksaan berhasil ditambahkan` })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }

})

// create /pasien get request
router.get('/pasien', basicAuthMiddleware, async (req, res) => {
  console.log("sini untuk pasien get")
  try {
    const cariannya = req.query.cariannya
    const jadwal = req.query.jadwal
    let response
    if(jadwal && jadwal =="jadwal"){
      const id = req.query.id
      if(!id){
        return res.status(400).send({ status: false, message: `id tidak diketahui` })
      }
      let cek_pasien = await tb_pasien.findOne({
        where: {
          nik: id
        }
      })
      if(!cek_pasien){
        return res.status(400).send({ status: false, message: `Pasien dengan id ${id} tidak ditemukan` })
      }

      response = await tb_rekam_medis.findAll({
        where: {
          id_pasien: id
        },
        include: [
          {
            model: tb_dokter,
          },
          {
            model: tb_pasien,
          }
        ]
      })


    }
    else if (cariannya) {
      response = await tb_pasien.findAll({
        where: {
          // 
          [Op.or]: [
            {
              nama: {
                [Op.or]: [
                  { [Op.like]: '%' + cariannya + '%' },
                ]
              }
            },
            {
              nik:{
                [Op.or]: [
                  { [Op.like]: '%' + cariannya + '%' },
                ]
              }
            }
          ]
        }
      })
    } else {
      response = await tb_pasien.findAll()
    }


    res.status(200).send({ status: true, data: response })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})

// create /pasien put request
router.put('/pasien', basicAuthMiddleware, async (req, res) => {
  console.log("sini untuk pasien put")
  try {
    const nik = req.query.nik

    if (!nik || !req.body.nama || !req.body.jenis_kelamin || !req.body.tgl_lahir || !req.body.alamat || !req.body.pekerjaan || !req.body.golongan_darah || !req.body.pendidikan || !req.body.no_telp || !req.body.status_pernikahan || !req.body.nama_orang_tua_wali || !req.body.nama_pasangan) {
      return res.status(400).send({ status: false, message: `Data tidak lengkap` })
    }

    let pasien = await tb_pasien.findOne({
      where: {
        nik: nik
      }
    })

    if (!pasien) {
      return res.status(400).send({ status: false, message: `Pasien dengan NIK ${nik} tidak terdaftar` })
    }
    
    let datanya = req.body
    // remove nik from datanya
    datanya = _.omit(datanya, ['nik'])
    // console.log(datanya, "ini data yang akan di update")
    await tb_pasien.update(datanya, {
      where: {
        nik: nik
      }
    })

    res.status(200).send({ status: true, message: `Data pasien dengan NIK ${nik} berhasil diubah` })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})

// create /jadwal_dokter get request
router.get('/jadwal_dokter', basicAuthMiddleware, async (req, res) => {
  console.log("sini untuk jadwal get")
  try {
    let today_date = new Date();
    let days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    let hari_ini = days[today_date.getDay()];
    let all_jadwal = await tb_jadwal_dokter.findAll({
      where: {
        hari: hari_ini
      },
      include: {
        model: tb_dokter,
        attributes: ['nama', 'spesialis']
      }
    })

    res.status(200).send({ status: true, data: all_jadwal })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})

// create /jadwal_dokter post request
router.post('/jadwal_dokter', basicAuthMiddleware, async (req, res) => {
  try{
    const data_jadwal = req.body
    if(!data_jadwal.id_dokter || !data_jadwal.hari || !data_jadwal.jam_mulai || !data_jadwal.jam_selesai){
      return res.status(400).send({ status: false, message: `Data tidak lengkap` })
    }
    let cek_dokter = await tb_dokter.findOne({
      where: {
        nik: data_jadwal.id_dokter
      }
    })
    if(!cek_dokter){
      return res.status(400).send({ status: false, message: `Dokter dengan id ${data_jadwal.id_dokter} tidak ditemukan` })
    }
    await tb_jadwal_dokter.create(data_jadwal)
    res.status(200).send({ status: true, message: `Jadwal dokter dengan id ${data_jadwal.id_dokter} berhasil ditambahkan` })
  }catch(err){
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})

// create /jadwal_dokter put request
router.put('/jadwal_dokter', basicAuthMiddleware, async (req, res) => {
  try{
    const data_jadwal = req.body
    if( !data_jadwal.id_dokter || !data_jadwal.hari || !data_jadwal.jam_mulai || !data_jadwal.jam_selesai){
      return res.status(400).send({ status: false, message: `Data tidak lengkap` })
    }
    let cek_dokter = await tb_dokter.findOne({
      where: {
        nik: data_jadwal.id_dokter
      }
    })
    if(!cek_dokter){
      return res.status(400).send({ status: false, message: `Dokter dengan id ${data_jadwal.id_dokter} tidak ditemukan` })
    }
    await tb_jadwal_dokter.update(data_jadwal, {
      where: {
        id_dokter: data_jadwal.id_dokter,
        hari: data_jadwal.hari
      }
    })
    res.status(200).send({ status: true, message: `Jadwal dokter dengan NIK ${data_jadwal.id_dokter} berhasil diubah` })
  }catch(err){
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})

// create /jadwal_pasien get request
router.get('/jadwal_pasien', basicAuthMiddleware, async (req, res) => {
  console.log("sini untuk jadwal get")
  try {
    let today_date = new Date();
    let dd = today_date.getDate();
    let mm = today_date.getMonth() + 1;
    let yyyy = today_date.getFullYear();
    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;
    let today_date_format = yyyy + '-' + mm + '-' + dd;
    let all_jadwal = await tb_rekam_medis.findAll({
      where: {
        tanggal_periksa: today_date_format
      },
      include: [
        {
          model: tb_dokter,
          // attributes: ['nama', 'spesialis']
        },
        {
          model: tb_pasien,
          // attributes: ['nama', 'nik', 'tgl_lahir', 'golongan_darah']
        }
      ],
      // attributes: ['tanggal_periksa', 'jam_periksa', "id_pasien"]
    })

    // calculate age

    res.status(200).send({ status: true, data: all_jadwal })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})

// create /jadwal_pasien post request
router.post('/jadwal_pasien', basicAuthMiddleware, async (req, res) => {
  try {
    const data = req.body
    // console.log(data, "ini datanya")
    if(!data.id_pasien && !data.tanggal_periksa && !data.jam_periksa && !data.id_dokter){
      return res.status(400).send({ status: false, message: `Data tidak lengkap` })
    }
    // calculate age
    await tb_rekam_medis.create(data)

    let response = await tb_rekam_medis.findAll({
      where: {
        id_pasien : data.id_pasien
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

    res.status(200).send({ status: true, data: response })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})

// create /jadwal_pasien put request
router.put('/jadwal_pasien', basicAuthMiddleware, async (req, res) => {
  try {
    const id_rekam_medis = req.query.id

    if (!id_rekam_medis || !req.body.id_pasien || !req.body.tanggal_periksa || !req.body.jam_periksa || !req.body.id_dokter) {
      return res.status(400).send({ status: false, message: `Data tidak lengkap` })
    }

    let pasien = await tb_rekam_medis.findOne({
      where: {
        id_rekam_medis: id_rekam_medis
      }
    })

    if (!pasien) {
      return res.status(400).send({ status: false, message: `Data dengan id ${id_rekam_medis} tidak ada` })
    }

    let datanya = req.body
    // remove id_pasien from datanya
    datanya = _.omit(datanya, ['id_pasien'])
    // console.log(datanya, "ini data yang akan di update")
    await tb_rekam_medis.update(datanya, {
      where: {
        id_rekam_medis: id_rekam_medis
      }
    })

    let response = await tb_rekam_medis.findAll({
      where: {
        id_pasien : req.body.id_pasien
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

    res.status(200).send({ status: true, message: `Data pasien dengan id ${id_rekam_medis} berhasil diubah` ,data : response})
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "internal server error" })
  }
})

module.exports = router