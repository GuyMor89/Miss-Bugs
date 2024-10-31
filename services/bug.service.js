import fs from 'fs'
import PDFDocument from 'pdfkit-table'

import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('data/bugs.json')

export const bugService = {
    query,
    getById,
    remove,
    save,
    setupPDF
}

function query(filterBy) {
    return Promise.resolve(bugs.filter(bug => bug.title.includes(filterBy.text)))
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

function setupPDF() {
    let doc = new PDFDocument({ margin: 30, size: 'A4' })

    function parseBugs() {
        let newBugs = bugs.map(({ title, description, severity }) => {
            return [title, description, severity]
        })
        return newBugs
    }

    doc.pipe(fs.createWriteStream('./bugs.pdf'))

    createPdf(doc)
        .then(() => doc.end())

    function createPdf() {
        const table = {
            title: 'Bugs',
            headers: ['Title', 'Description', 'Severity'],
            rows: parseBugs(),
        }
        return doc.table(table, { columnsSize: [125, 250, 50] })
    }
}

