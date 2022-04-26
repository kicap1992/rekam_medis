module.exports = (sequelize, Sequelize) => {
  const Login = sequelize.define("tb_login", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role : {
      type: Sequelize.STRING,
      allowNull: false
    },
  },{
    freezeTableName: true,
    tableName: 'tb_login',
  })

  return Login;
}