import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TransactionService from '../services/TransactionService';

export const TransactionListPage = () => {
    const [data, setData] = useState([]);
    const [apiError, setApiError] = useState();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        TransactionService.findAll()
            .then((response) => {
                setData(response.data);
                setApiError();
            })
            .catch((error) => {
                setApiError('Falha ao carregar a lista de transações');
            });
    };

    const onRemove = (id) => {
        TransactionService.remove(id).then((response) => {
            loadData();
            setApiError();
        }).catch((erro) => {
            setApiError('Falha ao remover transação');
        });
    };

    return (
        <div className="container">
            <h1 className="text-center">Lista de Transações</h1>
            <div className="text-center">
                <Link className="btn btn-success" to="/accounts/new">Nova Transação</Link>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Codigo</th>
                        <th>Valor</th>
                        <th>DataVenc</th>
                        <th>Categoria</th>
                        <th>Descrição</th>
                        <th>Tipo</th>
                        <th>Conta</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((transaction) => (
                        <tr>
                            <td>{transaction.id}</td>
                            <td>{transaction.value}</td>
                            <td>{transaction.dueDate}</td>
                            <td>{transaction.category}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.type}</td>
                            <td>{account.account.bank}</td>
                            <td>
                                <Link className="btn btn-primary"
                                    to={`/transactions/${transaction.id}`}>Editar</Link>

                                <button className="btn btn-danger"
                                    onClick={() => onRemove(transaction.id)}>
                                    Remover
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {apiError && (<div className="alert alert-danger">{apiError}</div>)}
        </div>
    );
}

export default TransactionListPage;