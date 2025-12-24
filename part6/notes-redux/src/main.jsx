import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";

import App from "./App";
import filterReducer from "./reducers/filterReducer";
import noteReducer from "./reducers/noteReducer";

const reducer = combineReducers({
    notes: noteReducer,
    filter: filterReducer,
});

const store = createStore(reducer);

console.log(store.getState());

import { createNote } from "./reducers/noteReducer";
import { filterChange } from "./reducers/filterReducer";

store.subscribe(() => console.log(store.getState()));
store.dispatch(filterChange("IMPORTANT"));
store.dispatch(createNote("combineReducers forms one reducer from many simple reducers"));

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <div />
    </Provider>
);
