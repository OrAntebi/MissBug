export function BugPreview({ bug }) {
    return <article className="bug-preview">
        <p className="title">{bug.title}</p>
        <p>Severity: <span>{bug.severity}</span></p>
        <section className="labels-container">
            {bug.labels
                .filter(label => label.trim())
                .map((label, idx) => (
                    <span key={idx} className="label">{label}</span>
                ))
            }
        </section>
    </article>
}