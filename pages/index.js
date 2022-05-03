// import Router from 'next/router'
import { useRouter } from 'next/router'
import { useEffect , useState } from 'react';


import ResponsiveAppBarIndex from "../components/before_login/appBar"
import GridIndex from "../components/before_login/body"

let all_function = require('../function/all_function.js')

 function Home(props) {
  // const router = useRouter();
  // // const error = !props.query.error ? false : true
  console.log(props)


  // useEffect(() => {
  //   if(!router.isReady) return;
  //   const query = router.query;
  // }, [router.isReady, router.query]);
  

  // let cekError;
  // if(router.query.error){
  //   cekError = true
  // }else{
  //   cekError = false
  // }
  
  return (
    <div>
      <ResponsiveAppBarIndex />
      <div><GridIndex errornya={props.query.error ? true : false}  jadwal_dokter={props.jadwal_dokter_today}/></div>
      {/* <div><GridIndex errornya={false} /></div> */}
      
    </div>
  )
}

// export async function getServerSideProps({req}) {
//   // console.log(req.query.error)
//   // if
//   return {
//     props: {
//       error: (req.query.error == 'true') ? true : false,
//     }
//   }
// }

// export async function getStaticProps() {
//   let jadwal_dokter_today = await all_function.jadwal_dokter_today_home();
//   return {
//     props: {
//       jadwal_dokter_today: jadwal_dokter_today,
//     },
//     revalidate: 10, 
//   }
// }


// ini untuk get query dari url
Home.getInitialProps = async ({ query }) => {
  // console.log(query)
  let jadwal_dokter_today = await all_function.jadwal_dokter_today_home();
  // const hehe = "ini dia"

  return {query, jadwal_dokter_today : jadwal_dokter_today }
}

export default Home