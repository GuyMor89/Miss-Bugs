
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
}


function query() {
    return axios.get(BASE_URL)
        .then(res => res.data)
}
function getById(bugID) {
    return axios.get(BASE_URL + bugID)
        .then(res => res.data)
}

function remove(bugID) {
    return axios.get(BASE_URL + bugID + '/remove')
        .then(res => res.data)
}

function save(bug) {
    return axios.get(BASE_URL + 'save' + `?title=${encodeURIComponent(bug.title)}&severity=${bug.severity}&_id=${bug._id || ''}`)
        .then(res => res.data)
}

