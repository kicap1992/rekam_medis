module.exports = (sequelize, Sequelize) => {
  const Obat = sequelize.define("tb_obat", {
    id_obat:{
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nama_obat:{
      type: Sequelize.STRING,
      allowNull: false
    },
    jenis:{
      type: Sequelize.STRING,
      allowNull: false
    },
    jumlah:{
      type: Sequelize.STRING,
      allowNull: false
    },
    harga:{
      type: Sequelize.STRING,
      allowNull: false
    },
    history:{
      type: Sequelize.TEXT("long"),
      allowNull: false
    }
  },{
    freezeTableName: true,
    tableName: 'tb_obat',
  })

  return Obat
}