module.exports = (sequelize, Sequelize) => {
  const Dokter = sequelize.define("tb_dokter", {
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
    alamat:{
      type: Sequelize.STRING,
      allowNull: false
    },
    no_telp:{
      type: Sequelize.STRING,
      allowNull: false
    },
    spesialis:{
      type: Sequelize.STRING,
      allowNull: false
    },
    status : {
      type: Sequelize.STRING,
      allowNull: false
    }
  },{
    freezeTableName: true,
    tableName: 'tb_dokter',
  })

  return Dokter
}