import axios from 'axios'
const baseUrl = 'https://notes-app-l34u.onrender.com'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => {
        const data = response.data
        if (Array.isArray(data)) {
            const nonExisting = {
                id: 10000,
                content: 'This note is not saved to server',
                important: true,
            }
            return data.concat(nonExisting)
        }
        return data
    })
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

export default { getAll, create, update }