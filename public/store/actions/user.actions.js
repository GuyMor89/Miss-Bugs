import { userService } from "../../services/user.service.js"
import { REMOVE_USER, SET_USER, SET_USERS } from "../reducers/user.reducer.js"
import { store } from "../store.js"

export const userActions = {
    loadLoggedInUser,
    loadUsers,
    loginUser,
    logoutUser,
    signupUser,
    updateUser,
    removeUser
}

function loadLoggedInUser() {
    return userService.getLoggedinUser()
        .then(user => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch(err => {
            console.error('Failed to load logged-in user:', err)
        })
}

function loadUsers() {
    return userService.query()
        .then(users => {
            store.dispatch({ type: SET_USERS, users })
        })
        .catch(err => {
            console.error('Failed to load user list:', err)
        })
}

function loginUser(credentials) {
    return userService.login(credentials)
        .then(user => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch(err => {
            console.error('Failed to load logged-in user:', err)
        })
}

function signupUser(credentials) {
    return userService.signup(credentials)
        .then(user => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch(err => {
            console.error('Failed to signup user:', err)
        })
}

function logoutUser() {
    return userService.logout()
        .then(() => {
            store.dispatch({ type: SET_USER, user: null })
        })
        .catch(err => {
            console.error('Failed to logout:', err)
        })
}

function updateUser(user) {
    return userService.updateUser(user)
        .then((user) => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch(err => {
            console.log('Cannot update user', err)
            throw err
        })
}

function removeUser(userID) {
    return userService.remove(userID)
        .then(() => {
            store.dispatch({ type: REMOVE_USER, userID })
        })
        .catch(err => {
            console.log('Cannot remove user:', err)
            throw err
        })
}