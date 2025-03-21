const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}


function query(filterBy) {
    return axios.get(BASE_URL)
        .then(res => res.data)
        .then(bugs => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }

            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }

            return bugs
        })
}

function getById(bugId) {
    const url = BASE_URL + bugId
    return axios.get(url)
        .then(res => res.data)
}

function remove(bugId) {
    const url = BASE_URL + bugId + '/remove'
    return axios.get(url)
}

function save(bug) {
    const url = BASE_URL + 'save'
    let queryParams = `?title=${bug.title}&description=${bug.description}&severity=${bug.severity}`

    if (bug._id) queryParams += `&_id=${bug._id}`
    return axios.get(url + queryParams)
        .then(res => res.data)
        .catch(err => {
            console.log('err', err)
        })
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}