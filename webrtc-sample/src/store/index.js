import {
  applyMiddleware,
  compose,
  createStore,
} from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from '@react-native-community/async-storage'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'

import rootReducer from '../reducers'
import * as actionCreators from '../actionCreators'

const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]
if (__DEV__) {
  middlewares.push(logger)
}

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
let store

export default function configureStore(preloadedState) {
  const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionCreators }) :
      compose

  const enhancer = composeEnhancers(
    applyMiddleware(...middlewares)
  )

  store = createStore(persistedReducer, preloadedState, enhancer)
  const persistor = persistStore(store)
  return {
    persistor,
    runSaga: sagaMiddleware.run,
    store,
  }
}

export { store }
