import React from 'react'
import CheckoutComponent from '../Hang/CheckoutComponent';
  
function ParentGiftsComponent () {
const data = "Hello Everyone";
    return(
        <div>
          <CheckoutComponent data={data}/>
        </div>
    );
}
  
export default ParentGiftsComponent;