import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
  SetLoading: "[SetLoading-Link] Action",
  SetActionProgress: "[SetActionProgress-Link] Action",

  LoadAll: "[LoadAll-Link] Action",
};

const initialAuthState = {
  list: [],
  isLoading: false,
  isSaving: false
};

export const reducer = persistReducer(
  { storage, key: "link" },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.SetLoading: {
        const { loading } = action.payload;
        return {
          ...state,
          isLoading: loading
        }
      }

      case actionTypes.SetActionProgress: {
        const { progress } = action.payload;
        return {
          ...state,
          isSaving: progress
        }
      }
  
      case actionTypes.LoadAll: {
        const { data } = action.payload;

        return { 
          isLoading: false,
          isSaving: false,
          list: data
        };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  loadAll: data => ({ type: actionTypes.LoadAll, payload: data }),

  setLoading: loading => ({ type: actionTypes.SetLoading, payload: { loading } }),
  setActionProgress: progress => ({ type: actionTypes.SetActionProgress, payload: { progress } })
};

export function* saga() {
}
