import fs from 'fs'
import PDFDocument from 'pdfkit-table'

import { utilHandler } from './util.handler.js'

const bugs = utilHandler.readJsonFile('data/bugs.json')
const PAGE_SIZE = 4

export const bugHandler = {
    query,
    getById,
    remove,
    save,
    setupPDF,
    hasBugs
}

function query(filterBy = {}) {
    let filteredBugs = bugs
    // const sort = JSON.parse(filterBy.sort)

    let sort
    try {
        sort = filterBy.sort ? JSON.parse(filterBy.sort) : null
    } catch (error) {
        console.error('Invalid JSON in filterBy.sort:', error)
        sort = null
    }    

    if (filterBy.text) {
        const regExp = new RegExp(filterBy.text, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title) || (bug.labels && bug.labels.some(label => regExp.test(label))))
    }
    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }
    if (sort && sort.severity) {
        filteredBugs = filteredBugs.sort((a, b) => (a.severity - b.severity) * sort.severity)
    }
    if (sort && sort.title) {
        filteredBugs = filteredBugs.sort((a, b) => (a.title.localeCompare(b.title)) * sort.title)
    }
    if (sort && sort.createdAt) {
        filteredBugs = filteredBugs.sort((a, b) => (a.createdAt - b.createdAt) * sort.createdAt)
    }
    const amountOfBugs = filteredBugs.length
    if (filterBy.page) {
        const pageStart = (filterBy.page * PAGE_SIZE)

        filteredBugs = filteredBugs.slice(pageStart, pageStart + PAGE_SIZE)
    }

    return Promise.resolve({ filteredBugs, amountOfBugs })
}

function getById(bugID) {
    const bug = bugs.find(bug => bug._id === bugID)
    if (!bug) return Promise.reject('Cannot find bug - ' + bugID)
    return Promise.resolve(bug)
}

function remove(bugID, user) {
    const bugIDx = bugs.findIndex(bug => bug._id === bugID)
    if (bugIDx < 0) return Promise.reject('Cannot find bug - ' + bugID)

    if (bugs[bugIDx].owner && bugs[bugIDx].owner._id !== user._id && !user.isAdmin) {
        return Promise.reject('Not authorized to delete this bug')
    }

    bugs.splice(bugIDx, 1)
    return _saveBugsToFile()
}

function save(data, user) {
    let bugToSave

    if (data._id) {
        const bugIDx = bugs.findIndex(bug => bug._id === data._id)
        if (bugIDx === -1) return Promise.reject('Couldn\'t find bug ID')

        if (bugs[bugIDx].owner._id !== user._id && !user.isAdmin) {
            return Promise.reject('Not authorized to update this bug')
        }

        bugToSave = {
            _id: data._id,
            createdAt: data.createdAt,
            updatedAt: Date.now(),
            title: data.title,
            severity: +data.severity,
            description: data.description,
            labels: data.labels,
            owner: data.owner
        }

        bugs[bugIDx] = bugToSave

    } else {
        bugToSave = {
            _id: utilHandler.makeId(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            title: data.title,
            severity: +data.severity,
            description: data.description,
            owner: data.owner
        }

        bugs.unshift(bugToSave)
    }
    return _saveBugsToFile()
        .then(() => bugToSave)
}

function hasBugs(userID) {
    const hasBugs = bugs.some(bug => bug.owner && bug.owner._id === userID)

    if (hasBugs) return Promise.reject('Cannot delete user with bugs')

    return Promise.resolve()
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

