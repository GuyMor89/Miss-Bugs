import { bugService } from '../services/bug.service.js'
import { userService } from '../services/user.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'

const { useState, useEffect } = React

export function BugIndex() {

    const [bugs, setBugs] = useState(null)
    const [amountOfBugs, setAmountOfBugs] = useState(null)
    const [filterBy, setFilterBy] = useState({ text: '', minSeverity: 0, page: 0, sort: { severity: '', title: '', createdAt: '' } })
    const [user, setUser] = useState(null)

    useEffect(() => {
        userService.getLoggedinUser()
            .then(setUser)
    }, [])

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(result => {
                const { filteredBugs, amountOfBugs } = result
                setBugs(filteredBugs)
                setAmountOfBugs(amountOfBugs)
            })
    }

    function filterBugs(event) {
        const form = event.target.form

        const searchValue = form.search.value
        const minSeverity = form['min-severity'].value

        setFilterBy({ ...filterBy, text: searchValue, minSeverity: minSeverity })
    }

    function onRemoveBug(bugID) {
        bugService
            .remove(bugID)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugID)
                // setBugs(bugsToUpdate)
                loadBugs()
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Bug description'),
            owner: {
                fullname: user.fullname,
                _id: user._id
            }
        }

        if (!bug.title || !bug.severity || !bug.description) return

        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                // setBugs([...bugs, savedBug])
                loadBugs()
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const description = prompt('New Description?') || bug.description

        const bugToSave = { ...bug, severity, description }
        console.log(bugToSave)
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function handlePageNumbers() {
        const startNum = (filterBy.page * 4) + 1
        const endNum = amountOfBugs < (filterBy.page * 4) + 4 ? amountOfBugs : (filterBy.page * 4) + 4
        return { startNum, endNum }
    }

    const { startNum, endNum } = handlePageNumbers()
    const { severity, title, createdAt } = filterBy.sort

    return (
        <main>
            <section className='info-actions'>
                <form onChange={filterBugs}>
                    <fieldset>
                        <input type='search' name='search' placeholder='Search bugs..'></input>
                        <label htmlFor="min-severity"> Min Severity</label>
                        <input type='range' name='min-severity' min={0} value={filterBy.minSeverity} max={10}></input>
                    </fieldset>
                </form>
                {user && <button onClick={onAddBug}>Add Bug</button>}
            </section>
            <div className="bug-list-counter">
                <div onClick={() => { severity === '' || severity === 1 ? setFilterBy({ ...filterBy, sort: { ...filterBy.sort, severity: -1 } }) : setFilterBy({ ...filterBy, sort: { ...filterBy.sort, severity: 1 } }) }}>
                    <i className={severity === '' || severity === 1 ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"}></i>
                    <span>Severity</span>
                </div>
                <div onClick={() => { createdAt === '' || createdAt === 1 ? setFilterBy({ ...filterBy, sort: { ...filterBy.sort, createdAt: -1 } }) : setFilterBy({ ...filterBy, sort: { ...filterBy.sort, createdAt: 1 } }) }}>
                    <i className={createdAt === '' || createdAt === 1 ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"}></i>
                    <span>Created At</span>
                </div>
                <div onClick={() => { title === '' || title === 1 ? setFilterBy({ ...filterBy, sort: { ...filterBy.sort, title: -1 } }) : setFilterBy({ ...filterBy, sort: { ...filterBy.sort, title: 1 } }) }}>
                    <i className={title === '' || title === 1 ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"}></i>
                    <span>Title</span>
                </div>
            </div>
            <div className='pagination'>
                <span>{startNum} - {endNum} of {amountOfBugs}</span>
                <i className={filterBy.page === 0 ? "fa-solid fa-angle-left faint" : "fa-solid fa-angle-left"} onClick={() => setFilterBy({ ...filterBy, page: filterBy.page - 1 })}></i>
                <i className={endNum === amountOfBugs ? "fa-solid fa-angle-right faint" : "fa-solid fa-angle-right"} onClick={() => setFilterBy({ ...filterBy, page: filterBy.page + 1 })}></i>
            </div>
            <main>
                <BugList bugs={bugs} user={user} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
            <button className='pdf-button' onClick={() => { bugService.downloadPDF(); showSuccessMsg('PDF Downloaded') }}>Download PDF</button>
        </main>
    )
}
