import { bugReducer } from "./reducers/bug.reducer.js"
import { userReducer } from "./reducers/user.reducer.js"

const { createStore, compose, combineReducers } = Redux

const rootReducer = combineReducers({
    bugModule: bugReducer,
    userModule: userReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(rootReducer, composeEnhancers())

// * For Debugging
window.gStore = store

store.subscribe(() => {
    console.log('Current state is:', store.getState())
})
