const express = require('express')
const next = require('next')
require("dotenv").config();

const formData = require('express-form-data');
const cors = require('cors');


const port_http = parseInt(process.env.PORT_HTTP) || 3007
const port_https = parseInt(process.env.PORT_HTTPS) || 3008
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// database
const db = require('./database/index.js');


app.prepare().then(() => {
  const server = express()
  const http = require('http')
  const https = require('https')
  const fs = require('fs')

  const options = {
    key: fs.readFileSync('./server/cert.key'),
    cert: fs.readFileSync('./server/cert.crt')
  }

  // database
  db.sequelize.authenticate({ force: false }).then(() => { // if want to alter table, set alter: true after sync , if dont want to create table in start, set sync to authenticate or otherwise
    console.log('Database connected')
    // db.dokter.sync({ alter : true }) // alter table specific
  }).catch (err => {
    console.log(err)
  })
  

  // middleware
  server.use(formData.parse());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.options('*', cors());
  server.use(cors());

  // import routes
  const login_router = require('./routes/login_router');
  const admin_router = require('./routes/admin_router');
  const dokter_router = require('./routes/dokter_router');

  // use routes
  server.use('/api/login', login_router);
  server.use('/api/admin', admin_router);
  server.use('/api/dokter', dokter_router);

  

  server.get('/api', (req, res) => {
    console.log("ada org request");
    return res.status(200).send({ status : true, message : 'connected to api'})
  });

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  http.createServer(server).listen(port_http, (err) => {
      if (err) throw err
  
      // console.log(`ini dia ${process.env.DB_CONNECTION}`)
      console.log(`> Ready on http://localhost:${port_http}`)
    })

  https.createServer (options, server).listen(port_https, (err) => {
    if (err) throw err
  
    // console.log(`ini dia ${process.env.DB_CONNECTION}`)
    console.log(`> Ready on https://localhost:${port_https}`)
  })
})