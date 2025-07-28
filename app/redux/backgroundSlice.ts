import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BackgroundState {
  theme: 'white' | 'dark' | 'blue';
}

const initialState: BackgroundState = {
  theme: 'white',
};

export const backgroundSlice = createSlice({
  name: 'background',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'white' | 'dark' | 'blue'>) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = backgroundSlice.actions;
export default backgroundSlice.reducer;