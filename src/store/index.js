import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

// Redux persist storage
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'
import { createTransform } from 'redux-persist'
import { stringify, parse } from 'flatted'

// Reducer
import rootReducer from '../reducers'

const transformCircular = createTransform(
  (inboundState, key) => stringify(inboundState),
  (outboundState, key) => parse(outboundState),
)

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['wallet', 'network'],
  transforms: [transformCircular],
}

// Configure root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure store
const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)))

const persistor = persistStore(store)

export {
  store,
  persistor,
}

