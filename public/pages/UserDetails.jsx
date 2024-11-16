const { useState, useEffect } = React

import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'

export function UserDetails() {

    const [user, setUser] = useState(null)
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState({ text: '', minSeverity: 0, page: null, sort: { severity: '', title: '', createdAt: '' } })

    useEffect(() => {
        userService.getLoggedinUser()
            .then(setUser)
    }, [])

    useEffect(() => {
        loadBugs()
    }, [user])

    function loadBugs() {
        if (!user) return
        bugService.query(filterBy)
            .then(result => {
                const ownedBugs = result.filteredBugs.filter(bug => bug.owner && bug.owner.fullname === user.fullname)
                setBugs(ownedBugs)
            })
    }

    if (!user) return

    const { _id, fullname, isAdmin } = user

    return (
        <div className='user-details'>
            <h2>Name: {fullname}</h2>
            <h3>ID: {_id}</h3>
            <h3>Is Admin: {isAdmin ? 'Yes' : 'No'}</h3>
            {bugs && bugs.length > 0 ? <BugList bugs={bugs} user={user} /> : 'You don\'t own any bugs'}
        </div>
    )
}