const { useNavigate } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

    const navigate = useNavigate()

    function handleBugClick(bugId, event) {
        event.preventDefault()
        navigate(`/bug/${bugId}`)
    }


    if (!bugs) return <div>Loading...</div>
    return <ul className="bug-list">
        {bugs.map(bug => (
            <li key={bug._id}>
                <BugPreview bug={bug} />
                <section className="actions">
                    <button onClick={(event) => handleBugClick(bug._id, event)}>Details</button>
                    <button onClick={() => onEditBug(bug)}>Edit</button>
                    <button onClick={() => onRemoveBug(bug._id)}>x</button>
                </section>
            </li>
        ))}
    </ul >
}
