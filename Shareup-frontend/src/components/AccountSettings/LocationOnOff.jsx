import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';


export default function LocationOnOff() {
  const val=true;
    const data = [{id: 0, label: "On"}, {id: 1, label: "Off"}];
    const [isOpen, setOpen] = useState(false);
  const [items, setItem] = useState(data);
  const [naaj, setNaaj] = useState();
  const [selectedItem, setSelectedItem] = useState(null);
  const toggleDropdown = () => setOpen(!isOpen);
  const handleItemClick = (id) => {
    selectedItem == id  ? setSelectedItem(null) : setSelectedItem(id);
    console.log('selsected itemsssssssss', selectedItem)
  }

  useEffect(() => {
const getLoc = JSON.parse(localStorage.getItem("location"));
if(getLoc){
  setNaaj(getLoc)
}


  
   
}, [])




return(               
<div className='dropdown wdthdrpdwn'>

<div className='dropdown-head' onClick={toggleDropdown}>


  { naaj ? "off": 'on' }
  <i className={`fa fa-chevron-right icon ${isOpen && "open"} ml-2`}></i>
</div>
<div className={`dropdown-body ${isOpen && 'open'}`}>
  {items.map(item => (
    <div className="dropdown-item" onClick={e =>{ handleItemClick(e.target.id); console.log(e.target.id); setOpen();}} id={item.id} >
      
      {item.label}
    </div>
  ))}
  
  
  
</div>
</div>
          )
        }