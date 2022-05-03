module.exports = (sequelize, Sequelize) => {
  const jadwal_dokter = sequelize.define('tb_jadwal_dokter', {
    id_jadwal: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hari : {
      type: Sequelize.STRING,
      allowNull: false
    },
    jam_mulai : {
      type: Sequelize.STRING,
      allowNull: false
    },
    jam_selesai : {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'tb_jadwal_dokter'
  })

  return jadwal_dokter
}