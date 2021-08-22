import { useEffect, useState } from "react"
import ShippingComponent from "./ShippingComponent"

const GeoLocator = props => {
    const [location, setLocation] = useState({ 
        lat: 51.501364, 
        lng: -0.141890 
    })
    const success = position => {
        const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }
        setLocation(coordinates)
    }
    useEffect(()=>{
        if (navigator.geolocation) {
            navigator.permissions
            .query({ name: "geolocation" })
            .then(function (result) {
                if (result.state === "granted") {
                   navigator.geolocation.getCurrentPosition(success)
                }
            });
        }
    },[])
    return (
        <div>
            <div className="container"  style={{maxWidth: "500px"}}>
                <ShippingComponent location={location} />
            </div>
        </div>
    )
}
export default GeoLocator