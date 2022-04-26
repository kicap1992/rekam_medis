const dbConfig = require('./db.config.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
})
const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

// load models
db.admin = require('./model/admin.model.js')(sequelize, Sequelize)
db.login = require('./model/login_user.model.js')(sequelize, Sequelize)
db.obat = require('./model/obat.model.js')(sequelize, Sequelize)
db.dokter = require('./model/dokter.model.js')(sequelize, Sequelize)
db.pasien = require('./model/pasien.model.js')(sequelize, Sequelize)
db.tindakan = require('./model/tindakan.model.js')(sequelize, Sequelize)
db.rekam_medis = require('./model/rekam_medis.model.js')(sequelize, Sequelize)

// create one to one relations between admin and login
db.admin.hasOne(db.login, {foreignKey: {name: 'id_admin', allowNull: true}}, {onDelete: 'CASCADE' , hooks: true , onUpdate: 'CASCADE'})
db.login.belongsTo(db.admin, {foreignKey: {name: 'id_admin', allowNull: true}}, {onDelete: 'CASCADE' , hooks: true , onUpdate: 'CASCADE'})

// create one to one relations between doker and login
db.dokter.hasOne(db.login, {foreignKey: {name: 'id_dokter', allowNull: true}}, {onDelete: 'CASCADE' , hooks: true , onUpdate: 'CASCADE'})
db.login.belongsTo(db.dokter, {foreignKey: {name: 'id_dokter', allowNull: true}}, {onDelete: 'CASCADE' , hooks: true , onUpdate: 'CASCADE'})

// create one to many relations between pasien and rekam_medis
db.pasien.hasMany(db.rekam_medis, {foreignKey: {name: 'id_pasien', allowNull: false}}, {onDelete: 'CASCADE' , hooks: true , onUpdate: 'CASCADE'})
db.rekam_medis.belongsTo(db.pasien, {foreignKey: {name: 'id_pasien', allowNull: false}}, {onDelete: 'CASCADE' , hooks: true , onUpdate: 'CASCADE'})

// create one to many relations between dokter and rekam_medis
db.dokter.hasMany(db.rekam_medis, {foreignKey: {name: 'id_dokter', allowNull: false}}, {onDelete: 'CASCADE' , hooks: true , onUpdate: 'CASCADE'})
db.rekam_medis.belongsTo(db.dokter, {foreignKey: {name: 'id_dokter', allowNull: false}}, {onDelete: 'CASCADE' , hooks: true , onUpdate: 'CASCADE'})


module.exports = db
// CRS-y5Vv-Xa5P-FTxTA