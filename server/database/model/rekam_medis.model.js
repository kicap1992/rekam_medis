module.exports = (sequelize, Sequelize) => {
  const RekamMedis = sequelize.define("tb_rekam_medis", {
    id_rekam_medis:{
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tanggal_periksa:{
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    jam_periksa:{
      type: Sequelize.TIME,
      allowNull: false
    },
    diagnosa:{
      type: Sequelize.TEXT("tiny"),
      allowNull: true,
      defaultValue: null
    },
    keluhan:{
      type: Sequelize.TEXT("tiny"),
      allowNull: true,
      defaultValue: null
    },
    keterangan:{
      type: Sequelize.TEXT("tiny"),
      allowNull: true,
      defaultValue: null
    },
    tindakan:{
      type: Sequelize.TEXT("tiny"),
      allowNull: true,
      defaultValue: null
    },
    obat : {
      type: Sequelize.TEXT("tiny"),
      allowNull: true,
      defaultValue: null
    }
  },{
    freezeTableName: true,
    tableName: 'tb_rekam_medis',
  });

  return RekamMedis
}