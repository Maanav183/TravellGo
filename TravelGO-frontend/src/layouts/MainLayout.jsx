import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {Outlet} from "react-router-dom";

function MainLayout(){
    return (
        <>
        <Navbar />
        
{/* <Link to="/buses" className="nav-link">
  <Bus size={18} /> Buses
</Link> */}
        <main style={{minHeight:"81vh",padding:"20px"}}>
        <Outlet/>  
        </main>
        <Footer />
        </>
    );
    }

    export default MainLayout;
