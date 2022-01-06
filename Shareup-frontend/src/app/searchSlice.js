import { createSlice } from "@reduxjs/toolkit";



const initialState = '';



const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            return state = action.payload;
      },

    
    
    },

  });
  
  export const {setSearchTerm} = searchSlice.actions;
  export default searchSlice.reducer;
  