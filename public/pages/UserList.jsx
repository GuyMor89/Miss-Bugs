const { useState, useEffect } = React
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'

export function UserList() {

    const [users, setUsers] = useState(null)

    useEffect(() => {
        getUsers()
    }, [])

    function getUsers() {
        userService.query()
            .then(setUsers)
    }

    function deleteUser(userID) {
        userService.remove(userID)
            .then(() => {
                showSuccessMsg('User deleted')
                getUsers()
            })
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