function FeaturedPackages(){
    return (
        <section style={{padding: "40px 20px",background:"#f3f4f6"}}>
             <h2>Featured Packages</h2>

             {[1,2,3].map((pkg)=>(
                <div key={pkg} style={{padding: "20px", border: "1px solid #e5e7eb",borderRadius: "12px",width:"250px"}}>
                    <h3>weekend getaway</h3>
                    <p>3 days 2 nights</p> <p>Starting from rs.5000</p>
                    </div>
             ))}
        </section>
    );
}
export default FeaturedPackages;