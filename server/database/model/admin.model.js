module.exports = (sequalize, Sequelize) => {
  const Admin = sequalize.define("tb_admin", {
    nik: {
      type: Sequelize.STRING(16),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    nama:{
      type: Sequelize.STRING,
      allowNull: false
    },
    // hehe :{
    //   type: Sequelize.STRING,
    // },
    role: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },{
    freezeTableName: true,
    tableName: 'tb_admin',
  });

  return Admin;
}