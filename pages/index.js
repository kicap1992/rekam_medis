import ResponsiveAppBarIndex from "../components/before_login/appBar"
import GridIndex from "../components/before_login/body"

 function Home(props) {
  //  console.log(props, "sini di home");
  return (
    <div>
      <ResponsiveAppBarIndex />
      <div><GridIndex errornya={props.error} /></div>
      
    </div>
  )
}

export async function getServerSideProps({req}) {
  // console.log(req.query.error)
  // if
  return {
    props: {
      error: (req.query.error == 'true') ? true : false,
    }
  }
}

export default Home