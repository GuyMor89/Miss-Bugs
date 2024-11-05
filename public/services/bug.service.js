
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    downloadPDF
}


function query(filterBy) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
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
    return axios.delete(BASE_URL + bugID)
        .then(res => res.data)
}

function save(bug) {
    console.log(bug)
    // return axios.get(BASE_URL + 'save' + `?title=${encodeURIComponent(bug.title)}&severity=${bug.severity}&_id=${bug._id || ''}&description=${bug.description}`)
    if (bug._id) {
        return axios.put(BASE_URL + bug._id, bug)
            .then(res => res.data)
            .catch(err => {
                console.log('err:', err)
                throw err
            })
    } else {
        return axios.post(BASE_URL, bug)
            .then(res => res.data)
            .catch(err => {
                console.log('err:', err)
                throw err
            })
    }

}

function downloadPDF() {
    return axios.get(BASE_URL + 'pdf')
        .then(res => res.data)
}

