import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AccountService from '../services/AccountService';

export const AccountListPage = () => {
    const [data, setData] = useState([]);
    const [apiError, setApiError] = useState();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        AccountService.findAll()
            .then((response) => {
                setData(response.data);
                setApiError();
            })
            .catch((error) => {
                setApiError('Falha ao carregar a lista de contas');
            });
    };

    const onRemove = (number) => {
        AccountService.remove(number).then((response) => {
            loadData();
            setApiError();
        }).catch((erro) => {
            setApiError('Falha ao remover conta');
        });
    };

    return (
        <div className="container">
            <h1 className="text-center">Lista de Contas</h1>
            <div className="text-center">
                <Link className="btn btn-success" to="/accounts/new">Nova Conta</Link>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Numero</th>
                        <th>Agencia</th>
                        <th>Banco</th>
                        <th>Tipo</th>
                        <th>Usuario</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((account) => (
                        <tr>
                            <td>{account.number}</td>
                            <td>{account.agency}</td>
                            <td>{account.bank}</td>
                            <td>{account.type}</td>
                            <td>{account.user.name}</td>
                            <td>
                                <Link className="btn btn-primary"
                                    to={`/accounts/${account.number}`}>Editar</Link>

                                <button className="btn btn-danger"
                                    onClick={() => onRemove(account.number)}>
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

export default AccountListPage;