import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  saveToModal: false,
  addTopic: false,
  selectedCounterarg: null,
  savedCounterargs: [],
  unsaveModal: false,
  unsaveDataBody: {},
  deleteTopicModal: false,
  deleteTopicDataBody: {},
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
    showAddTopic: (state) => {
      state.addTopic = true;
    },
    hideAddTopic: (state) => {
      state.addTopic = false;
    },
    setSelectedCounterarg: (state, action) => {
      state.selectedCounterarg = action.payload;
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
    setSavedCounterargs: (state, action) => {
      state.savedCounterargs = action.payload;
    },
    resetSavedCounterargs: (state) => {
      state.savedCounterargs = [];
    },
    showUnsaveModal: (state) => {
      state.unsaveModal = true;
    },
    hideUnsaveModal: (state) => {
      state.unsaveModal = false;
    },
    setUnsaveDataBody: (state, action) => {
      state.unsaveDataBody = action.payload;
    },
    showDeleteTopicModal: (state) => {
      state.deleteTopicModal = true;
    },
    hideDeleteTopicModal: (state) => {
      state.deleteTopicModal = false;
    },
    setDeleteTopicDataBody: (state, action) => {
      state.deleteTopicDataBody = action.payload;
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
  setSavedCounterargs,
  resetSavedCounterargs,
  showUnsaveModal,
  hideUnsaveModal,
  setUnsaveDataBody,
  showDeleteTopicModal,
  hideDeleteTopicModal,
  setDeleteTopicDataBody,
} = counterargSlice.actions;

export default counterargSlice.reducer;
