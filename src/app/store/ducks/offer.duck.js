import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
  SetLoading: "[SetLoading-Offer] Action",
  LoadAll: "[LoadAll-Offer] Action",
};

const initialAuthState = {
  list: [],
  isLoading: false,
  isSaving: false
};

export const reducer = persistReducer(
  { storage, key: "offer" },
  (state = initialAuthState, action) => {
    switch (action.type) {   
      case actionTypes.SetLoading: {
        const { loading } = action.payload;
        return {
          ...state,
          isLoading: loading
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
  create: data => ({ type: actionTypes.Create, payload: data }),
  update: data => ({ type: actionTypes.Update, payload: data }),
  delete: id => ({ type: actionTypes.Delete, payload: { id } }),
  loadAll: data => ({ type: actionTypes.LoadAll, payload: data }),

  setLoading: loading => ({ type: actionTypes.SetLoading, payload: { loading } }),
  setActionProgress: progress => ({ type: actionTypes.SetActionProgress, payload: { progress } })
};

export function* saga() {
}
