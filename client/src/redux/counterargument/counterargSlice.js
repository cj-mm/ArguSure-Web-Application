import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  saveToModal: false,
  addTopic: false,
  selectedCounterarg: null,
  displayedCounterargs: [],
  savedCounterargs: [],
};

const counterargSlice = createSlice({
  name: "counterarg",
  initialState,
  reducers: {
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
  showSaveToModal,
  hideSaveToModal,
  showAddTopic,
  hideAddTopic,
  setSelectedCounterarg,
  setDisplayedCounterargs,
  addToSavedCounterargs,
  removeFromSavedCounterargs,
  resetSavedCounterargs,
} = counterargSlice.actions;

export default counterargSlice.reducer;
