import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  showModal: false,
  saveToModal: false,
  addTopic: false,
  selectedCounterarg: null,
  displayedCounterargs: [],
  savedCounterargs: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    showDeleteModal: (state) => {
      state.showModal = true;
    },
    hideDeleteModal: (state) => {
      state.showModal = false;
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    showSaveToModal: (state) => {
      state.saveToModal = true;
    },
    hideSaveToModal: (state) => {
      state.saveToModal = false;
    },
    showAddTopic: (state, action) => {
      state.addTopic = action.payload;
    },
    hideAddTopic: (state) => {
      state.addTopic = false;
    },
    setSelectedCounterarg: (state, action) => {
      state.selectedCounterarg = action.payload;
    },
    setDisplayedCounterargs: (state, action) => {
      if (action.payload === "reset") {
        state.displayedCounterargs = [];
        return;
      }
      if (Array.isArray(state.displayedCounterargs)) {
        state.displayedCounterargs.push(action.payload);
      } else {
        state.displayedCounterargs = [action.payload];
      }
    },
    addToSavedCounterargs: (state, action) => {
      if (Array.isArray(state.savedCounterargs)) {
        if (!state.savedCounterargs.includes(action.payload)) {
          state.savedCounterargs.push(action.payload);
        }
      } else {
        state.savedCounterargs = [action.payload];
      }
    },
    removeFromSavedCounterargs: (state, action) => {
      if (Array.isArray(state.savedCounterargs)) {
        let index = state.savedCounterargs.indexOf(action.payload);
        if (index !== -1) {
          state.savedCounterargs.splice(index, 1);
        }
      }
    },
    resetSavedCounterargs: (state) => {
      state.savedCounterargs = [];
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  showDeleteModal,
  hideDeleteModal,
  signOutSuccess,
  showSaveToModal,
  hideSaveToModal,
  showAddTopic,
  hideAddTopic,
  setSelectedCounterarg,
  setDisplayedCounterargs,
  addToSavedCounterargs,
  removeFromSavedCounterargs,
  resetSavedCounterargs,
} = userSlice.actions;

export default userSlice.reducer;
