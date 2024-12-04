const { useState, useEffect } = React
const { useSelector } = ReactRedux

import { BugList } from '../cmps/BugList.jsx'
import { userActions } from '../store/actions/user.actions.js'
import { bugActions } from '../store/actions/bug.actions.js'

export function UserDetails() {

    const user = useSelector(storeState => storeState.userModule.loggedInUser)
    const filterBy = useSelector(storeState => storeState.bugModule.filterBy)
    const [ownedBugs, setOwnedBugs] = useState(null)

    useEffect(() => {
        userActions.loadLoggedInUser()
    }, [])

    useEffect(() => {
        loadBugs()
    }, [user])

    function loadBugs() {
        if (!user) return
        return bugActions.loadBugs(filterBy)
            .then(result => {
                setOwnedBugs(result.filter(bug => bug.owner && bug.owner.fullname === user.fullname))
            })
    }


    if (!user) return

    const { _id, fullname, isAdmin } = user

    return (
        <div className='user-details'>
            <h2>Name: {fullname}</h2>
            <h3>ID: {_id}</h3>
            <h3>Is Admin: {isAdmin ? 'Yes' : 'No'}</h3>
            {ownedBugs && ownedBugs.length > 0 ? <BugList bugs={ownedBugs} user={user} /> : 'You don\'t own any bugs'}
        </div>
    )
}