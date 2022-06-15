import axios from 'axios';

const getTransactionsTotal = () => {
    return axios.get('/transactions/total', {headers: getAuthHeader()});
}

const MovimentAccountService = {
    getTransactionsTotal
}

const getAuthHeader = () => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) {
        return {Authorization: `Bearer ${token}`}; //'Bearer ' + token
    } else {
        return {}
    }
}

export default MovimentAccountService;