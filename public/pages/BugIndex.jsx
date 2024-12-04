import { bugService } from '../services/bug.service.js'
import { bugActions } from '../store/actions/bug.actions.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { CHANGE_FILTER_BY } from '../store/reducers/bug.reducer.js'

const { useState, useEffect } = React
const { useSelector, useDispatch } = ReactRedux

export function BugIndex() {

    const dispatch = useDispatch()

    const bugs = useSelector(storeState => storeState.bugModule.bugs)
    const amountOfBugs = useSelector(storeState => storeState.bugModule.amountOfBugs)
    const filterBy = useSelector(storeState => storeState.bugModule.filterBy)
    const user = useSelector(storeState => storeState.userModule.loggedInUser)

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugActions.loadBugs(filterBy)
    }

    function filterBugs(event) {
        const form = event.target.form

        const searchValue = form.search.value
        const minSeverity = form['min-severity'].value

        dispatch({ type: CHANGE_FILTER_BY, filterBy: { text: searchValue, minSeverity: minSeverity } })
    }

    function onRemoveBug(bugID) {
        bugActions.removeBug(bugID)
            .then(() => {
                console.log('Deleted Succesfully!')
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

        bugActions.saveBug(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
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

        bugActions.saveBug(bugToSave)
            .then(() =>
                showSuccessMsg('Bug updated')
            )
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function handlePageSwitching(diff) {
        dispatch({ type: CHANGE_FILTER_BY, filterBy: { page: filterBy.page + diff } })
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
                <i className={filterBy.page === 0 ? "fa-solid fa-angle-left faint" : "fa-solid fa-angle-left"} onClick={() => handlePageSwitching(-1)}></i>
                <i className={endNum === amountOfBugs ? "fa-solid fa-angle-right faint" : "fa-solid fa-angle-right"} onClick={() => handlePageSwitching(1)}></i>
            </div>
            <main>
                <BugList bugs={bugs} user={user} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
            <button className='pdf-button' onClick={() => { bugService.downloadPDF(); showSuccessMsg('PDF Downloaded') }}>Download PDF</button>
        </main>
    )
}
