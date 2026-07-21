// import { createSlice } from "@reduxjs/toolkit";

// const chatSlice = createSlice({
//     name:"chat",
//     initialState:{
//         onlineUsers:[],
//         messages:[],
//     },
//     reducers:{
//         // actions
//         setOnlineUsers:(state,action) => {
//             state.onlineUsers = action.payload;
//         },
//         setMessages:(state,action) => {
//             state.messages = action.payload;
//         }
//     }
// });
// export const {setOnlineUsers, setMessages} = chatSlice.actions;
// export default chatSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",

    initialState: {
        onlineUsers: [],

        // direct chat
        messages: [],

        // group chat
        groups: [],
        selectedGroup: null,
        groupMessages: [],
    },

    reducers: {

        // -------------------
        // ONLINE USERS
        // -------------------

        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },

        // -------------------
        // DIRECT CHAT
        // -------------------

        setMessages: (state, action) => {
            state.messages = action.payload;
        },

        // -------------------
        // GROUPS
        // -------------------

        setGroups: (state, action) => {
            state.groups = action.payload;
        },

        setSelectedGroup: (state, action) => {
            state.selectedGroup = action.payload;
        },

        // -------------------
        // GROUP MESSAGES
        // -------------------

        setGroupMessages: (state, action) => {
            state.groupMessages = action.payload;
        },

        addGroupMessage: (state, action) => {
            state.groupMessages.push(action.payload);
        }
    }
});

export const {

    setOnlineUsers,

    setMessages,

    setGroups,

    setSelectedGroup,

    setGroupMessages,

    addGroupMessage

} = chatSlice.actions;

export default chatSlice.reducer;