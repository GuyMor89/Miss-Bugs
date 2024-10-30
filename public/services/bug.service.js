
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


function query(filterBy) {
    return axios.get(BASE_URL)
        .then(res => res.data)
        .then(bugs => bugs.filter(bug => bug.title.includes(filterBy.text)))
}
function getById(bugID) {
    return axios.get(BASE_URL + bugID)
        .then(res => res.data)
        .catch(err => {
            if (err.response && err.response.status === 401) {
                console.log('Wait for a bit')
            }
            throw err
        })
}

function remove(bugID) {
    return axios.get(BASE_URL + bugID + '/remove')
        .then(res => res.data)
}

function save(bug) {
    console.log(bug)
    return axios.get(BASE_URL + 'save' + `?title=${encodeURIComponent(bug.title)}&severity=${bug.severity}&_id=${bug._id || ''}&description=${bug.description}`)
        .then(res => res.data)
}

