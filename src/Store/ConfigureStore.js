import { createStore } from 'redux'
import handleGlobalStetChange from './Reducers/Reducer'

export default createStore(handleGlobalStetChange)