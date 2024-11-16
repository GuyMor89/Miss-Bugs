const { useNavigate, useLocation } = ReactRouterDOM
const { useState, useEffect } = React

import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, user, onRemoveBug, onEditBug }) {

    const navigate = useNavigate()
    const location = useLocation()

    function handleButtons(bug) {
        if (!user) return false
        if (user.isAdmin) return true
        if (bug.owner && bug.owner.fullname === user.fullname) return true
    }

    if (!bugs) return <div>Loading...</div>

    return (
        <ul className="bug-list">
            {bugs.map((bug) => (
                <li className="bug-preview" key={bug._id}>
                    <BugPreview bug={bug} />
                    <div>
                        <button onClick={() => navigate(`/bug/${bug._id}`)}><i className="fa-solid fa-book-open"></i></button>
                        {handleButtons(bug) && <React.Fragment>
                            <button onClick={() => onRemoveBug(bug._id)}><i className="fa-regular fa-trash-can"></i></button>
                            <button onClick={() => onEditBug(bug)}><i className="fa-regular fa-pen-to-square"></i></button>
                        </React.Fragment>}
                    </div>
                </li>
            ))
            }
        </ul >
    )
}
