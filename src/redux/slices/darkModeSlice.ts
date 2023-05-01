import { Mode } from '@anatoliygatt/dark-mode-toggle';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface DarkModeState {
  mode: Mode;
}

const loadInitialMode = (): Mode => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === 'light' || savedMode === 'dark') {
    return savedMode;
  }
  return 'light';
};

const initialState: DarkModeState = {
  mode: loadInitialMode(),
};

const darkModeSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
      localStorage.setItem('darkMode', action.payload);
    },
  },
});

export const { setMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;
