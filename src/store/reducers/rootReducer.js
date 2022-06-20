import { combineReducers } from "redux";
import userReducer from "./userReducer";
import authReducer from "./authReducer";
import appReducer from "./appReducer";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { persistReducer } from "redux-persist";

const commonConfig = {
    storage,
    stateReconciler: autoMergeLevel2
}

const authConfig = {
    ...commonConfig,
    key: 'auth',
    whitelist: ['isLoggedIn', 'user'],
}
const userConfig = {
    ...commonConfig,
    key: 'user',
    blacklist: ['allDataUser', 'msg']
}

const rootReducer = combineReducers({
    auth: persistReducer(authConfig, authReducer),
    user: persistReducer(userConfig, userReducer),
    app: appReducer
})

export default rootReducer