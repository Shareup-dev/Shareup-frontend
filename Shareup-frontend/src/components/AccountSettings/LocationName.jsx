import React from 'react'

function LocationName({currentLocation}) {
    return (
        <div>
            <div className="right-settings-bio">
                  <p className="clrHead pdngbtm">Where you Loged in</p>
                  <p className="secrtySec text-right">{currentLocation}</p>
                </div>
        </div>
    )
}

export default LocationName
