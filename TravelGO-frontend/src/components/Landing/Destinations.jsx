function Destinations()
{
const cities=["Agra","Delhi","Goa","Jaipur","Manali","Mumbai","Pune"];

return (
<section style={{padding: "40px 20px"}}>
    <h2>Explore by City</h2>

    <div style={{display:"flex",gap:"16px",marginTop:"16px"}}>
    {cities.map((city)=>(
        <div key={city} style={{padding: "20px", border: "1px solid #041f55",borderRadius: "12px",minWidth: "120px",textAlign: "center"}}>
           <h3>{Agra}</h3>
           <h3>{Delhi}</h3>
           <h3>{Goa}</h3>
           <h3>{Jaipur}</h3>
           <h3>{Manali}</h3>
           <h3>{Mumbai}</h3>
           <h3>{Pune}</h3>
        </div>
        ))}
        </div>
 <p style={{marginTop:"12px",color:"#f2f1f4"}}>3d views and all</p>
</section>
);

}

export default Destinations;