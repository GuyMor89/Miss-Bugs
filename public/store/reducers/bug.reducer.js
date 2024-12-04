export const SET_BUGS = 'SET_BUGS'
export const REMOVE_BUG = 'REMOVE_BUG'
export const ADD_BUG = 'ADD_BUG'
export const UPDATE_BUG = 'UPDATE_BUG'
export const SET_AMOUNT_OF_BUGS = 'SET_AMOUNT_OF_BUGS'
export const SET_IS_LOADING = 'IS_LOADING'
export const CHANGE_FILTER_BY = 'CHANGE_FILTER_BY'

const initialState = {
    bugs: [],
    amountOfBugs: null,
    isLoading: false,
    filterBy: { text: '', minSeverity: 0, page: 0, sort: { severity: '', title: '', createdAt: '' } }
}

export function bugReducer(state = initialState, action) {
    switch (action.type) {

        case SET_BUGS:
            return { ...state, bugs: action.filteredBugs }

        case REMOVE_BUG:
            return {
                ...state,
                bugs: state.bugs.filter(bug => bug._id !== action.bugId)
            }
        case ADD_BUG:
            return {
                ...state,
                bugs: [...state.bugs, action.bug]
            }
        case UPDATE_BUG:
            return {
                ...state,
                bugs: state.bugs.map(bug => bug._id === action.bug._id ? action.bug : bug)
            }
        case SET_AMOUNT_OF_BUGS:
            return { ...state, amountOfBugs: action.amountOfBugs }

        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }
        case CHANGE_FILTER_BY:
            return {
                ...state,
                filterBy: { ...state.filterBy, ...action.filterBy }
            }

        default:
            return state
    }
}
