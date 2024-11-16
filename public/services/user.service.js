// const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'
const BASE_URL = '/api/user/'

export const userService = {
    login,
    signup,
    logout,
    getLoggedinUser,
    remove,
    query,
    getById,
    getEmptyCredentials
}

function query() {
    return axios.get('/api/user').then(res => res.data)
}

function login({ username, password }) {
    return axios.post('/api/auth/login', { username, password })
        .then(res => res.data)
        .then(user => {
            // _setLoggedinUser(user)
            return user
        })
}

function signup({ username, password, fullname }) {
    return axios.post('/api/auth/signup', { username, password, fullname })
        .then(res => res.data)
        .then(user => {
            // _setLoggedinUser(user)
            return user
        })
}

function logout() {
    return axios.post('/api/auth/logout')
        .then(() => {
            // sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        })
}

function getLoggedinUser() {
    // return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
    return axios.get('/api/auth/verify')
        .then(res => res.data)
}

function getById(userId) {
    return axios.get(BASE_URL + userId)
        .then(res => res.data)
}

function remove(userId) {
    return axios.delete('/api/user/' + userId)
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}
