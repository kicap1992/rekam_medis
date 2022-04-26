module.exports = (sequelize, Sequelize) => {
  const Tindakan = sequelize.define("tb_tindakan", {
    id_tindakan:{
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nama_tindakan:{
      type: Sequelize.STRING,
      allowNull: false
    }
  },{
    freezeTableName: true,
    tableName: 'tb_tindakan',
  })

  return Tindakan
}