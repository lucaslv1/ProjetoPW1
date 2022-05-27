import axios from 'axios';

const save = (transaction) => {
    return axios.post('/transactions', transaction, {headers: getAuthHeader()});
}

const findAll = () => {
    return axios.get('/transactions', {headers: getAuthHeader()});
}

const findOne = (id) => {
    return axios.get(`/transactions/${id}`, {headers: getAuthHeader()});
}

const remove = (id) => {
    return axios.delete(`/transactions/${id}`, {headers: getAuthHeader()});
}

const TransactionService = {
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

export default TransactionService;