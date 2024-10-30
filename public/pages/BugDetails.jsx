const { useState, useEffect } = React
const { Link, useParams, useNavigate } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'


export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => {
                setBug(bug)
            })
            .catch(err => {
                navigate('/bug')
                showErrorMsg('Wait a bit..')
            })
    }, [])

    if (!bug) return <h1>loadings....</h1>

    const { title, severity, description, createdAt } = bug

    return (<div>
        <h3>Bug Details 🐛</h3>
        <h4>{title}</h4>
        <h5>{description}</h5>
        <p>Severity: <span>{severity}</span></p>
        <Link to="/bug">Back to List</Link>
    </div>)

}

