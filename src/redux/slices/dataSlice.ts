import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { json } from "react-router-dom";

export interface ChampionState {
  name: string;
  difficulty: string;
  summoners: string[];
  primaryRunes: { keystone: string; minors: string[] };
  secondaryRunes: string[];
  shards: string[];
  items: string[];
  notes: string;
}

interface BanState {
  name: string;
  comment: string;
}

interface DataState {
  championData: ChampionState;
  bans: BanState[];
  isLive: boolean;
  status: string;
  error: string;
}

const initialState: DataState = {
  championData: {
    name: "",
    difficulty: "",
    summoners: [],
    primaryRunes: {
      keystone: "",
      minors: [],
    },
    secondaryRunes: [],
    shards: [],
    items: [],
    notes: "",
  },
  bans: [],
  isLive: false,
  status: "idle",
  error: "",
};

const googleSheetsApiKey: string = process.env
  .REACT_APP_GOOGLE_SHEETS_API_KEY as string;

export const removeSpecialCharacters = (str: string) => {
  return str.replace(/[.'\s]/g, "");
};

export const fetchSheetData = async () => {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/1k1qodMOvtY3s6388ANcHlDSyNozEqGacjc2HUO2T7yY/values/%27Toplane%20Matchups%27!A10:Z?alt=json&key=${googleSheetsApiKey}`
    );
    const data = await response.json();
    const championDataArray = data.values
      .map((value: string[], index: number) => {
        if (index % 2 === 0) {
          const {
            0: name,
            1: summoner1,
            2: difficulty,
            3: keystone,
            4: primaryMinor1,
            5: primaryMinor2,
            6: primaryMinor3,
            7: item1,
            8: item2,
            9: item3,
            10: notes,
          } = value;

          const {
            1: summoner2,
            2: secondaryMinor1,
            3: secondaryMinor2,
            4: shard1,
            5: shard2,
            6: shard3,
            7: item4,
            8: item5,
            9: item6,
          } = data.values[index + 1];

          return {
            name,
            difficulty,
            summoners: [summoner1, summoner2],
            primaryRunes: {
              keystone,
              minors: [primaryMinor1, primaryMinor2, primaryMinor3],
            },
            secondaryRunes: [secondaryMinor1, secondaryMinor2],
            shards: [shard1, shard2, shard3],
            items: [item1, item2, item3, item4, item5, item6],
            notes,
          };
        } else {
          return null;
        }
      })
      .filter(Boolean);
    return championDataArray;
  } catch (error) {
    throw json({ message: `${error.message} spreadsheet data` });
  }
};

const fetchSheetBans = async () => {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/1l3w-cQ9vGLMNZ1dvqIYL68vypXSnQSVPyiOpdAZXxmo/values/%27Toplane%20Matchups%27!B5:C7?alt=json&key=${googleSheetsApiKey}`
    );
    const data = await response.json();
    const bansData = data.values.map((value: string[]) => {
      if (value[0] === "Illoai") {
        return {
          name: "Illaoi",
          comment: value[1],
        };
      } else {
        return {
          name: value[0],
          comment: value[1],
        };
      }
    });
    return bansData;
  } catch {
    throw Error("No response");
  }
};

const findChampionData = async (
  championName: string
): Promise<ChampionState> => {
  const championDataArray = await fetchSheetData();
  const championData = championDataArray.find(
    (championObject: ChampionState) =>
      removeSpecialCharacters(championObject.name).toLowerCase() ===
      championName.toLowerCase()
  );
  if (championData) {
    return championData;
  } else {
    throw Error("Champion not found");
  }
};

export const fetchChampionData = createAsyncThunk(
  "sheet/fetchSheetData",
  async (champion: string) => {
    return findChampionData(champion);
  }
);

export const checkChannelLive = createAsyncThunk("twitchAPI", async () => {
  const clientId: string = process.env.REACT_APP_TWITCH_CLIENT_ID as string;
  const clientSecret: string = process.env
    .REACT_APP_TWITCH_CLIENT_SECRET as string;

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const accessToken = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: body,
  })
    .then((response) => response.json())
    .catch((error) => console.error(error));

  const response = await fetch(
    `https://api.twitch.tv/helix/streams?user_login=aizolol`,
    {
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${accessToken.access_token}`,
      },
    }
  );
  const data = await response.json();
  if (data.data.length > 0) {
    return true;
  } else {
    return false;
  }
});

export const fetchBans = createAsyncThunk("sheet/fetchSheetBans", async () => {
  const bansData = await fetchSheetBans();
  return bansData;
});

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    reset: (state) => {
      state.championData = initialState.championData;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChampionData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchChampionData.fulfilled,
        (state, action: PayloadAction<ChampionState>) => {
          state.status = "succeeded";
          state.championData = action.payload;
        }
      )
      .addCase(fetchChampionData.rejected, (state, action) => {
        state.status = "failed";
        if (action.error.message) {
          state.error = action.error.message;
        }
      })
      .addCase(fetchBans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchBans.fulfilled,
        (state, action: PayloadAction<BanState[]>) => {
          state.status = "succeeded";
          state.bans = action.payload;
        }
      )
      .addCase(fetchBans.rejected, (state, action) => {
        state.status = "failed";
        if (action.error.message) {
          state.error = action.error.message;
        }
      })
      .addCase(checkChannelLive.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        checkChannelLive.fulfilled,
        (state, action: PayloadAction<boolean>) => {
          state.status = "succeeded";
          state.isLive = action.payload;
        }
      )
      .addCase(checkChannelLive.rejected, (state, action) => {
        state.status = "failed";
        if (action.error.message) {
          state.error = action.error.message;
        }
      });
  },
});

export const { reset } = dataSlice.actions;

export default dataSlice.reducer;
