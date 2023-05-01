import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChampionState, fetchSheetData } from './dataSlice';
import { json } from 'react-router-dom';

interface InputState {
  champions: ChampionObject[];
  value: string;
  status: string;
  error: string;
  isFocused: boolean;
}

interface ChampionObject {
  name: string;
  imgUrl: string;
}

const initialState: InputState = {
  champions: [],
  value: '',
  status: 'idle',
  error: '',
  isFocused: true,
};

export const fetchRiotVersion = async () => {
  try {
    const versionResponse = await fetch(
      'https://ddragon.leagueoflegends.com/api/versions.json'
    );
    const versionData: string[] = await versionResponse.json();
    const latestVersion = versionData[0];
    return latestVersion;
  } catch (error) {
    throw json({
      message: `${error.message} Riot version`,
    });
  }
};

export const fetchRiotData = async (latestVersion: string) => {
  try {
    const championsResponse = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
    );
    const championsData = await championsResponse.json();
    return championsData;
  } catch (error) {
    throw json({ message: `${error.message} Riot data` });
  }
};

const findChampionIndex = (
  name: string,
  championsData: Record<string, any>
) => {
  for (const championIndex in championsData) {
    if (championsData[championIndex].name === name) {
      return championIndex;
    }
  }
  return null;
};

export const fetchChampionTable = createAsyncThunk(
  'championTable',
  async () => {
    const latestVersion = await fetchRiotVersion();
    const riotData = await fetchRiotData(latestVersion);
    const sheetData = await fetchSheetData();
    const championsData = riotData.data;

    const listOfChampions = sheetData
      .filter((champion: ChampionState) =>
        findChampionIndex(champion.name, championsData)
      )
      .map((champion: ChampionState) => {
        const championIndex = findChampionIndex(champion.name, championsData);
        if (championIndex) {
          const image = championsData[championIndex]?.image?.full;
          return {
            name: champion.name,
            imgUrl: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${image}`,
          };
        }
        return null;
      })
      .filter(Boolean);

    return listOfChampions;
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    setFocus: (state, action: PayloadAction<boolean>) => {
      state.isFocused = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChampionTable.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchChampionTable.fulfilled,
        (state, action: PayloadAction<ChampionObject[]>) => {
          state.status = 'succeeded';
          state.champions = action.payload;
        }
      )
      .addCase(fetchChampionTable.rejected, (state, action) => {
        state.status = 'failed';
        if (action.error.message) {
          state.error = action.error.message;
        }
      });
  },
});

export const { setValue, setFocus } = searchSlice.actions;
export default searchSlice.reducer;
