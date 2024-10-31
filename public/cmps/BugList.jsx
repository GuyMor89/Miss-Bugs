const { useNavigate } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

    const navigate = useNavigate()

    if (!bugs) return <div>Loading...</div>

    return (
        <ul className="bug-list">
            {bugs.map((bug) => (
                <li className="bug-preview" key={bug._id}>
                    <BugPreview bug={bug} />
                    <div>
                        <button onClick={() => onRemoveBug(bug._id)}><i className="fa-regular fa-trash-can"></i></button>
                        <button onClick={() => onEditBug(bug)}><i className="fa-regular fa-pen-to-square"></i></button>
                        <button onClick={() => navigate(`/bug/${bug._id}`)}><i className="fa-solid fa-book-open"></i></button>
                    </div>
                </li>
            ))
            }
        </ul >
    )
}
