import React, { useState, useEffect, useContext } from 'react';


export default function DropdownLimitsComponent() {
    const data = [{id: 0, label: "Limit"}, {id: 1, label: "Not limit"}];
const [isOpen, setOpen] = useState(false);
  const [items, setItem] = useState(data);
  const [selectedItem, setSelectedItem] = useState(null);
  const toggleDropdown = () => setOpen(!isOpen);
  const handleItemClick = (id) => {
    selectedItem == id ? setSelectedItem(null) : setSelectedItem(id);
  }

return(               <div className='dropdown wdthdrpdwn'>
<div className='dropdown-head' onClick={toggleDropdown}>
  {selectedItem ? items.find(item => item.id == selectedItem).label : "Limit"}
  <i className={`fa fa-chevron-right icon ${isOpen && "open"}`}></i>
</div>
<div className={`dropdown-body ${isOpen && 'open'}`}>
  {items.map(item => (
    <div className="dropdown-item" onClick={e => handleItemClick(e.target.id)} id={item.id}>
      
      {item.label}
    </div>
  ))}
</div>
</div>
          )
        }