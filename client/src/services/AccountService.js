import axios from 'axios';

const save = (account) => {
    return axios.post('/accounts', account, {headers: getAuthHeader()});
}

const findAll = () => {
    return axios.get('/accounts', {headers: getAuthHeader()});
}

const findOne = (number) => {
    return axios.get(`/accounts/${number}`, {headers: getAuthHeader()});
}

const remove = (number) => {
    return axios.delete(`/accounts/${number}`, {headers: getAuthHeader()});
}

const AccountService = {
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

export default AccountService;