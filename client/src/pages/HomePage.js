import React, { useEffect, useState } from 'react';
import MovimentAccountService from '../services/MovimentAccountService.js';

export const HomePage = () => {
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [apiError, setApiError] = useState();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        MovimentAccountService.getTransactionsTotal()
            .then((response) => {
                setData(response.data);
                setApiError();
            })
            .catch((error) => {
                setApiError('Falha ao carregar movimentações por transação');
            });
        MovimentAccountService.getAccountsTotal()
            .then((response) => {
                setData1(response.data);
                setApiError();
            })
            .catch((error) => {
                setApiError('Falha ao carregar movimentações por transação');
            });
    };

    /*const onRemove = (id) => {
        TransactionService.remove(id).then((response) => {
            loadData();
            setApiError();
        }).catch((erro) => {
            setApiError('Falha ao remover transação');
        });
    };*/

    return (
        <div className="container">
            <h1 className="text-center">Movimentações</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Numero Conta</th>
                        <th>Nome Banco</th>
                        <th>Tipo Transação</th>
                        <th>Valor Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((transact) => (
                        <tr>
                            <td>{transact.account.number}</td>
                            <td>{transact.account.bank}</td>
                            <td>{transact.typeTransaction}</td>
                            <td>{transact.valueTotal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <table className="table table-striped"> 
                <thead>
                    <tr>
                        <th>Numero Conta</th>
                        <th>Nome Banco</th>
                        <th>Tipo Conta</th>
                        <th>Saldo</th>
                    </tr>
                </thead>
                <tbody>
                    {data1.map((accounts) => (
                        <tr>
                            <td>{accounts.account.number}</td>
                            <td>{accounts.account.bank}</td>
                            <td>{accounts.account.typeAccount}</td>
                            <td>{accounts.saldo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {apiError && (<div className="alert alert-danger">{apiError}</div>)}
        </div>
    );
}

export default HomePage;