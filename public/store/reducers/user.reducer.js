export const SET_USER = 'SET_USER'
export const SET_USERS = 'SET_USERS'
export const SET_ACTIVITIES = 'SET_ACTIVITIES'
export const SET_BALANCE = 'SET_BALANCE'
export const REMOVE_USER = 'REMOVE_USER'

const initialState = {
    userActivities: [],
    users: [],
    loggedInUser: null
}

export function userReducer(state = initialState, action) {
    switch (action.type) {

        case SET_USER:
            return {
                ...state,
                loggedInUser: action.user
            }
        case SET_USERS:
            return {
                ...state,
                users: action.users
            }
        case REMOVE_USER:
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.userID)
            }
        case SET_ACTIVITIES:
            return {
                ...state,
                userActivities: [...state.userActivities, action.message]
            }
        case SET_BALANCE:
            return {
                ...state,
                loggedInUser: { ...state.loggedInUser, balance: state.loggedInUser.balance + action.amount || 10010 }
            }

        default:
            return state
    }
}
