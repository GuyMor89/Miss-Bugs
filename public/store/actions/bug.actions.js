import { bugService } from "../../services/bug.service.js"
import { SET_BUGS, UPDATE_BUG, ADD_BUG, REMOVE_BUG, SET_IS_LOADING, SET_AMOUNT_OF_BUGS } from "../reducers/bug.reducer.js"
import { store } from "../store.js"

export const bugActions = {
    loadBugs,
    saveBug,
    removeBug
}

function loadBugs(filterBy) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    return bugService.query(filterBy)
        .then(({ filteredBugs, amountOfBugs}) => {
            store.dispatch({
                type: SET_BUGS,
                filteredBugs
            })
            store.dispatch({
                type: SET_AMOUNT_OF_BUGS,
                amountOfBugs
            })
            return filteredBugs
        })
        .catch(err => {
            console.log('Bug action -> Cannot load Bugs', err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        })
}

function removeBug(bugId) {
    return bugService.remove(bugId)
        .then(() => {
            store.dispatch({ type: REMOVE_BUG, bugId })
        })
        .catch(err => {
            console.log('Bug action -> Cannot remove Bug', err)
            throw err
        })
}

function saveBug(bug, user) {
    const type = bug._id ? UPDATE_BUG : ADD_BUG
    return bugService.save(bug, user)
        .then((savedBug) => {
            store.dispatch({ type, bug: savedBug })
            return savedBug
        })
        .catch(err => {
            console.log('Bug action -> Cannot save Bug', err)
            throw err
        })
}