import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { takeLatest } from "redux-saga/effects";

export const actionTypes = {
  SetLoading: "[SetLoading-SerieType] Action",
  SetActionProgress: "[SetActionProgress-SerieType] Action",
  Create: "[Create-SerieType] Action",
  Update: "[Updated-SerieType] Action",
  Delete: "[Delete-SerieType] Action",
  Load: "[Load-SerieType] Action",
  LoadAll: "[LoadAll-SerieType] Action",
  LoadRequest: "[LoadRequest-SerieType] Action",
};

const initialAuthState = {
  list: [],
  isLoading: false,
  isSaving: false
};

export const reducer = persistReducer(
  { storage, key: "serie_type" },
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

      case actionTypes.Create: {
        const { data } = action.payload;
        const list = state.list || [];
        list.push(data);

        return {
          isLoading: false,
          isSaving: false,
          list : list
        };
      }

      case actionTypes.Update: {
        const { data } = action.payload;
        const list = state.list || [];
        const newList = list.map((x) => {
          if (x.id === data.id) return data;
          return x;
        });

        return {
          isLoading: false,
          isSaving: false,
          list : newList
        };
      }

      case actionTypes.Delete: {
        const { id } = action.payload;
        const list = state.list || [];
        const newList = list.filter((x) => x.id !== id);
        console.log(newList)

        return { 
          isLoading: false,
          isSaving: false,
          list: newList 
        };
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
  loadRequest: () => ({ type: actionTypes.LoadRequest, payload: null }),

  setLoading: loading => ({ type: actionTypes.SetLoading, payload: { loading } }),
  setActionProgress: progress => ({ type: actionTypes.SetActionProgress, payload: { progress } })
};

export function* saga() {
  yield takeLatest(actionTypes.LoadRequest, function* loginSaga() {
    // yield put(auth_actions.requestUser());

  //   yield put(actions.setLoading(true));
  //   api.loadAll()
  //     .then((result) => {
  //       setValues({...values, success: "Loading links success!"})
  //       yield put(actions.loadAll(result.data || []));
  //     })
  //     .catch((error) => {
  //       setValues({...values, error: "Error in loading links!"})
  //       yield put(actions.setLoading(false));
  //     })
  });
}
