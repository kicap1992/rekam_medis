module.exports = (sequelize, Sequelize) => {
  const RekamMedis = sequelize.define("tb_rekam_medis", {
    id_rekam_medis:{
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tanggal_perikas:{
      type: Sequelize.DATE,
      allowNull: false
    },
    diagnosa:{
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    keluhan:{
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    keterangan:{
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    tindakan:{
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    },
    obat : {
      type: Sequelize.TEXT("tiny"),
      allowNull: false
    }
  },{
    freezeTableName: true,
    tableName: 'tb_rekam_medis',
  });

  return RekamMedis
}