import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
  SetLoading: "[SetLoading-Report] Action",
  LoadGameSummary: "[LoadGamesSummary-Report] Action",
  LoadGameStats: "[LoadGamesStats-Report] Action",
};

const initialAuthState = {
  game_amount_data: [],
  game_stats: [],
  isLoading: false,
};

export const reducer = persistReducer(
  { storage, key: "report" },
  (state = initialAuthState, action) => {
    switch (action.type) {   
      case actionTypes.SetLoading: {
        const { loading } = action.payload;
        return {
          ...state,
          isLoading: loading
        }
      }

      case actionTypes.LoadGameSummary: {
        const { game_amount_data } = action.payload;

        return { 
          ...state,
          isLoading: false,
          game_amount_data: game_amount_data
        };
      }

      case actionTypes.LoadGameStats: {
        return { 
          ...state,
          isLoading: false,
          game_stats: action.payload
        };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  loadGameSummary: data => ({ type: actionTypes.LoadGameSummary, payload: data }),
  loadGameStats: data => ({ type: actionTypes.LoadGameStats, payload: data }),

  setLoading: loading => ({ type: actionTypes.SetLoading, payload: { loading } }),
};

export function* saga() {
}
