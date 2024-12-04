const { useState, useEffect } = React
const { useSelector, useDispatch } = ReactRedux

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { userActions } from '../store/actions/user.actions.js'

export function UserList() {

    const users = useSelector(storeState => storeState.userModule.users)

    useEffect(() => {
        getUsers()
    }, [])

    function getUsers() {
        userActions.loadUsers()
    }

    function deleteUser(userID) {
        userActions.removeUser(userID)
            .then(() => showSuccessMsg('User deleted'))
            .catch(() => showErrorMsg('Cannot delete user with bugs'))
}

if (!users) return <div>Loading..</div>

return (
    <section className='user-list'>
        {users.map(user => {
            return <div>
                <h3>{user.fullname}</h3>
                <h4>{user._id}</h4>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
            </div>
        })}
    </section>
)
}