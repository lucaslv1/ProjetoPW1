import axios from 'axios';

const save = (user) => {
    return axios.post('/users', user, {headers: getAuthHeader()});
}

const findAll = () => {
    return axios.get('/users', {headers: getAuthHeader()});
}

const findOne = (id) => {
    return axios.get(`/users/${id}`, {headers: getAuthHeader()});
}

const remove = (id) => {
    return axios.delete(`/users/${id}`, {headers: getAuthHeader()});
}

const UserService = {
    save,
    findAll,
    findOne,
    remove
}

const getAuthHeader = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) {
        return {Authorization: `Bearer ${token}`}; //'Bearer ' + token
    } else {
        return {}
    }
}

export default UserService;