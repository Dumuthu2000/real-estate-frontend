import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state, action)=>{
            state.loading = true;
        },
        signInSuccess: (state, action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFaliure: (state, action)=>{
            state.error = action.payload;
            state.loading = false;
        },

        //Update User
        updateUserStart: (state, action)=>{
            state.loading = true;
        },
        updateUserSuccess: (state, action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure: (state, action)=>{
            state.error = action.payload;
            state.loading = false;
        },
    }
});

export const { 
    signInStart, 
    signInSuccess, 
    signInFaliure,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure, } = userSlice.actions;
export default userSlice.reducer;