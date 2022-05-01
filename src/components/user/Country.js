import React, { useState } from 'react';
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';


function Example({setHomeTown,setCurrentTown}) {

const [country, setCountry]=useState('')
const [region, setRegion]=useState('')


function selectCountry(val){

    setCountry(val)
    setCurrentTown(val)
    console.log("working baaaaaaaaaaaa")
}
function selectRegion(val){

    setRegion(val)
    setHomeTown(val)
    console.log("working baaaaaaaaaaaa vvvvvvvvvv")

}


    return (
             <div className='d-flex flex-column align-items-start details-p'>
        <p>Current country?</p>

        <CountryDropdown className=" mb-3 text-dark" style={{  borderColor:'#033347'}} aria-label=".form-select-lg example"
          value={country}
          onChange={(val) => selectCountry(val)} />
        <p>Current Home town?</p>

        <RegionDropdown className=" mb-3 text-dark" style={{  borderColor:'#033347'}} aria-label=".form-select-lg example"
          country={country}
          value={region}
          onChange={(val) => selectRegion(val)} />
      </div>
    )
}

export default Example;











// import React, { Component } from 'react';

// // note that you can also export the source data via CountryRegionData. It's in a deliberately concise format to 
// // keep file size down
// import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';


// class Example extends Component {
//   constructor (props) {
//     super(props);
//     this.state = { country: '', region: '' };
//   }

//   selectCountry (val) {
//     this.setState({ country: val });
//     this.setCurrentTown({country:val})
//     console.log('at last working')
//   }

//   selectRegion (val) {
//     this.setState({ region: val });
//   }

//   render () {
//     const { country, region } = this.state;
//     return (
//       <div>
//         <CountryDropdown
//           value={country}
//           onChange={(val) => this.selectCountry(val)
          
//           } />
//         <RegionDropdown
//           country={country}
//           value={region}
//           onChange={(val) => this.selectRegion(val)} />
//       </div>
//     );
//   }
// }
// export default Example;