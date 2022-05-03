
// const md5 = require('md5');
module.exports = {
  thousandSeparator: function (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  cek_user : async function cek_user(username, password, role) {
    // console.log(username, password, role, "sini di cek user");
    try {
      let http_server = process.env.HTTP_URL+"/api/login?username="+username+"&password="+password+"&role="+role;
      // console.log(http_server);
      const response = await fetch(http_server, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
        }
      });
      const data = await response.json();
      // console.log(response , "ini response");
      if(response.status == 200){
        // console.log(data , "ini data");
        return true;
      }else{
        return false;
      }
    } catch (error) {
      return false
    }
    
  },
  tindakan_all : async function tindakan_all() {
    try {
      let http_server = process.env.HTTP_URL+"/api/admin/tindakan";
      // console.log(http_server);
      const response = await fetch(http_server, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        }
      });
      const data = await response.json();
      // console.log(response , "ini response");
      if(response.status == 200){
        // console.log(data , "ini data");
        return data.data;
      }else{
        return false;
      }
    } catch (error) {
      return false
    }
  },
  obat_all : async function obat_all() {
    try {
      let http_server = process.env.HTTP_URL+"/api/admin/obat";
      // console.log(http_server);
      const response = await fetch(http_server, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        }
      });
      const data = await response.json();
      // console.log(response , "ini response");
      if(response.status == 200){
        // console.log(data , "ini data");
        return data.data;
      }else{
        return false;
      }
    } catch (error) {
      return false
    }
  },
  dokter_all : async function() {
    try {
      let http_server = process.env.HTTP_URL+"/api/admin/dokter";
      // console.log(http_server);
      const response = await fetch(http_server, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        }
      });
      const data = await response.json();
      // console.log(response , "ini response");
      if(response.status == 200){
        // console.log(data , "ini data");
        return data.data;
      }else{
        return false;
      }
    } catch (error) {
      return false
    }
  },
  pasien_all : async function() {
    try {
      let http_server = process.env.HTTP_URL+"/api/admin/pasien";
      // console.log(http_server);
      const response = await fetch(http_server, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        }
      });
      const data = await response.json();
      // console.log(response , "ini response");
      if(response.status == 200){
        // console.log(data , "ini data");
        return data.data;
      }else{
        return false;
      }
    } catch (error) {
      return false
    }
  },
  jadwal_dokter_today : async function(){
    try {
      // return hari_ini
      let http_server = process.env.HTTP_URL+"/api/admin/jadwal_dokter";
      // console.log(http_server);
      const response = await fetch(http_server, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        }
      });
      const data = await response.json();
      // console.log(response , "ini response");
      if(response.status == 200){
        // console.log(data , "ini data");
        return data.data;
      }else{
        return false;
      }
    } catch (error) {
      return false
    }
  },
  jadwal_pasien_today : async function(){
    try {
      // return hari_ini
      let http_server = process.env.HTTP_URL+"/api/admin/jadwal_pasien";
      // console.log(http_server);
      const response = await fetch(http_server, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        }
      });
      const data = await response.json();
      // console.log(response , "ini response");
      if(response.status == 200){
        // console.log(data , "ini data");
        return data.data;
      }else{
        return false;
      }
    } catch (error) {
      return false
    }
  },
  jadwal_dokter_today_home : async function(){
    try {
      // return hari_ini
      let http_server = process.env.HTTP_URL+"/api/login/jadwal_dokter";
      // console.log(http_server);
      const response = await fetch(http_server, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        }
      });
      const data = await response.json();
      // console.log(response , "ini response");
      if(response.status == 200){
        // console.log(data , "ini data");
        return data.data;
      }else{
        return false;
      }
    } catch (error) {
      return false
    }
  },
  get_jadwal_dokter : async function(id){
    try {
      // return hari_ini
      let http_server = process.env.HTTP_URL+"/api/dokter/jadwal_dokter?id="+id;
      // console.log(http_server);
      const response = await fetch(http_server, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        }
      });
      const data = await response.json();
      // console.log(response , "ini response");
      if(response.status == 200){
        // console.log(data , "ini data");
        return data.data;
      }else{
        return false;
      }
    } catch (error) {
      return false
    }
  },
  jadwal_ini_hari : async function(id){
    try {
      // return hari_ini
      let http_server = process.env.HTTP_URL+"/api/dokter/jadwal_ini_hari?id="+id;
      // console.log(http_server);
      const response = await fetch(http_server, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        }
      });
      const data = await response.json();
      // console.log(response , "ini response");
      if(response.status == 200){
        // console.log(data , "ini data");
        return data.data;
      }else{
        return false;
      }
    } catch (error) {
      return false
    }
  },
  cek_data_rekam_medis : async function(id,id_dokter){
    try {
      // return hari_ini
      let http_server = process.env.HTTP_URL+"/api/dokter/cek_data_rekam_medis?id="+id+"&id_dokter="+id_dokter;
      // console.log(http_server);
      const response = await fetch(http_server, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'allow-cors-origin': '*',
          'crossDomain': true,
          'Authorization': 'Basic ' + btoa(`${process.env.ADMIN_AUTH}:${process.env.ADMIN_PASSWORD}`)
        }
      });
      const data = await response.json();
      // console.log(response , "ini response");
      if(response.status == 200){
        // console.log(data , "ini data");
        return data.data;
      }else{
        return false;
      }
    } catch (error) {
      return false
    }
  }
}