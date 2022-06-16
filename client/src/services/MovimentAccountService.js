import axios from 'axios';

const getTransactionsTotal = () => {
    return axios.get('/transactions/total', {headers: getAuthHeader()});
}

const getAccountsTotal = () => {
    return axios.get('/transactions/totalaccounts', {headers: getAuthHeader()});
}

const MovimentAccountService = {
    getTransactionsTotal,
    getAccountsTotal
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