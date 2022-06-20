import { createStore, applyMiddleware } from "redux";
import rootReducer from "./store/reducers/rootReducer";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";

const configStore = () => {
    let store = createStore(rootReducer, applyMiddleware(thunk))
    let persistor = persistStore(store)

    return { store, persistor }
}

export default configStore