import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUseSaveDataFromStorage, setUseSaveDataInStorage } from "../data";

export enum MapPortalLinesType {
  Always,
  Hover,
}

export const mapSettingsSlice = createSlice({
  name: "mapSettingsState",
  initialState: {
    showTrainerData: false,
    showItemData: false,
    highlightItems: false,
    highlightTMs: false,
    highlightHiddenItems: false,
    showMapPortals: false,
    showMapPortalLines: false,
    showMapPortalLinesType: MapPortalLinesType.Always,
    showRoutes: false,
    useSaveData: getUseSaveDataFromStorage(),
    forceClearMarks: 0,
  },
  reducers: {
    setShowTrainerData: (state, action: PayloadAction<boolean>) => {
      state.showTrainerData = action.payload;
    },
    setShowItemData: (state, action: PayloadAction<boolean>) => {
      state.showItemData = action.payload;
    },
    setHighlightItems: (state, action: PayloadAction<boolean>) => {
      state.highlightItems = action.payload;
    },
    setHighlightTMs: (state, action: PayloadAction<boolean>) => {
      state.highlightTMs = action.payload;
    },
    setHighlightHiddenItems: (state, action: PayloadAction<boolean>) => {
      state.highlightHiddenItems = action.payload;
    },
    setShowMapPortals: (state, action: PayloadAction<boolean>) => {
      state.showMapPortals = action.payload;
    },
    setShowMapPortalLines: (state, action: PayloadAction<boolean>) => {
      state.showMapPortalLines = action.payload;
    },
    setShowMapPortalLinesType: (
      state,
      action: PayloadAction<MapPortalLinesType>
    ) => {
      state.showMapPortalLinesType = action.payload;
    },
    setShowRoutes: (state, action: PayloadAction<boolean>) => {
      state.showRoutes = action.payload;
    },
    setUseSaveData: (state, action: PayloadAction<boolean>) => {
      const useSaveData = action.payload;
      state.useSaveData = useSaveData;
      setUseSaveDataInStorage(useSaveData);
    },
    triggerForceClearMarks: (state) => {
      // Just increment the value to trigger listeners
      state.forceClearMarks = state.forceClearMarks + 1;
    },
  },
});
