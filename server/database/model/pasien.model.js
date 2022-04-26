module.exports = (sequelize, Sequelize) => {
  const Pasien = sequelize.define("tb_pasien", {
    nik:{
      type: Sequelize.STRING(16),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    nama:{
      type: Sequelize.STRING,
      allowNull: false   
    },
    jenis_kelamin:{
      type: Sequelize.STRING(10),
      allowNull: false
    },
    tgl_lahir:{
      type: Sequelize.DATE,
      allowNull: false
    },
    alamat:{
      type: Sequelize.STRING,
      allowNull: false
    },
    pekerjaan:{
      type: Sequelize.STRING,
      allowNull: false
    },
    golongan_darah:{
      type: Sequelize.STRING(3),
    },
    pendidikan:{
      type: Sequelize.STRING,
    },
    no_telp:{
      type: Sequelize.STRING(13),
    },
    status_pernikahan:{
      type: Sequelize.STRING(15),
    },
    nama_orang_tua_wali:{
      type: Sequelize.STRING,
    },
    nama_pasangan:{
      type: Sequelize.STRING,
    }

  },{
    freezeTableName: true,
    tableName: 'tb_pasien',
  });

  return Pasien;
}