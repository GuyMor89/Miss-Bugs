import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('data/bugs.json')

export const bugService = {
    query,
    getById,
    remove,
    save
}

function query() {
    return Promise.resolve(bugs)
}

function getById(bugID) {
    const bug = bugs.find(bug => bug._id === bugID)
    if (!bug) return Promise.reject('Cannot find bug - ' + bugID)
    return Promise.resolve(bug)
}

function remove(bugID) {
    const bugIDx = bugs.findIndex(bug => bug._id === bugID)
    if (bugIDx < 0) return Promise.reject('Cannot find bug - ' + bugID)
    bugs.splice(bugIDx, 1)
    return _saveBugsToFile()
}

function save(bugToSave) {
    console.log(bugToSave)

    if (bugToSave._id) {
        const bugIDx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[bugIDx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile()
        .then(() => bugToSave)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}