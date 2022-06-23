import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ButtonWithProgress from '../components/ButtonWithProgress';
import Input from '../components/input';
import AccountService from '../services/AccountService';
import TransactionService from '../services/TransactionService';


export const TransactionFormPage = () => {
    const [form, setForm] = useState({
        id: null,
        value: null,
        dueDate: null,
        category: '',
        description: '',
        typeTransaction: 'Withdraw',
        account: null,
        accountD: null
    });
    const [errors, setErrors] = useState({});
    const [pendingApiCall, setPendingApiCall] = useState(false);
    const [apiError, setApiError] = useState();
    const [accounts, setAccounts] = useState([]);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        AccountService.findAll().then((response) => {
            setAccounts(response.data);
            if (id) {
                TransactionService.findOne(id).then((response) => {
                    if (response.data) {
                        setForm({
                            id: response.data.id,
                            value: response.data.value,
                            dueDate: response.data.dueDate,
                            category: response.data.category,
                            description: response.data.description,
                            typeTransaction: response.data.typeTransaction,
                            account: response.data.account.number,
                            accountD: response.data.account.number
                        });
                        setApiError();
                    } else {
                        setApiError('Falha ao carregar a transação');
                    }
                }).catch((erro) => {
                    setApiError('Falha ao carregar a transação');
                });
            }
            if (form.account == null && response.data[0] != null) {
                setForm((previousForm) => {
                    return {
                        ...previousForm,
                        account: response.data[0].number,
                    };
                });
            }
            if (form.accountD == null && response.data[0] != null) {
                setForm((previousForm) => {
                    return {
                        ...previousForm,
                        accountD: response.data[0].number,
                    };
                });
            }
            setApiError();
        }).catch((erro) => {
            setApiError('Falha ao carregar a combo de contas.');
        });
    }, [id]);

    const onChange = (event) => {
        const { value, name } = event.target;
        setForm((previousForm) => {
            return {
                ...previousForm,
                [name]: value,
            };
        });
        setErrors((previousErrors) => {
            return {
                ...previousErrors,
                [name]: undefined,
            };
        });
    };

    const onSubmit = () => {
        const transaction = {
            id: form.id,
            value: form.value,
            dueDate: form.dueDate,
            category: form.category,
            description: form.description,
            typeTransaction: form.typeTransaction,
            account: { number: form.account },
            accountD: { number: form.accountD}
        };
        setPendingApiCall(true);
        TransactionService.save(transaction).then((response) => {
            setPendingApiCall(false);
            navigate('/transactions');
        }).catch((error) => {
            if (error.response.data && error.response.data.validationErrors) {
                setErrors(error.response.data.validationErrors);
            } else {
                setApiError('Falha ao salvar transação.');
            }
            setPendingApiCall(false);
        });
    };

    return (
        <div className="container">
            <h1 className="text-center">Cadastro de Transação</h1>
            <div className="col-12 mb-3">
                <label>Operação</label>
                <select
                    className="form-control"
                    name="typeTransaction"
                    value={form.typeTransaction}
                    onChange={onChange}
                >
                    <option key="Withdraw" value="Withdraw">Saque</option>
                    <option key="Deposit" value="Deposit">Deposito</option>
                    <option key="Checks" value="Checks">Extrato</option>
                    <option key="Payment" value="Payment">Pagamento</option>
                    <option key="Transfer" value="Transfer">Transferencia</option>
                </select>
                {errors.typeTransaction && (
                    <div className="invalid-feedback d-block">{errors.typeTransaction}</div>
                )}
            </div>
            <div className="col-12 mb-3">
                <Input
                    name="value"
                    label="Valor"
                    placeholder="Informe o valor"
                    value={form.value}
                    onChange={onChange}
                    hasError={errors.value && true}
                    error={errors.value}
                />
            </div>
            <div className="col-12 mb-3">
                <Input
                    name="dueDate"
                    label="Data de vencimento"
                    placeholder="Informe a data de vencimento"
                    value={form.dueDate}
                    onChange={onChange}
                    hasError={errors.dueDate && true}
                    error={errors.dueDate}
                />
            </div>
            <div className="col-12 mb-3">
                <Input
                    name="category"
                    label="Categoria"
                    placeholder="Informe a categoria"
                    value={form.category}
                    onChange={onChange}
                    hasError={errors.category && true}
                    error={errors.category}
                />
            </div>
            <div className="col-12 mb-3">
                <label>Descrição</label>
                <textarea
                    className="form-control"
                    name="description"
                    placeholder="Informe a descrição"
                    value={form.description}
                    onChange={onChange}
                ></textarea>
                {errors.description && (
                    <div className="invalid-feedback d-block">{errors.description}</div>
                )}
            </div>
            <div className="col-12 mb-3">
                <label>Conta</label>
                <select
                    className="form-control"
                    name="account"
                    value={form.account}
                    onChange={onChange}
                >
                    {accounts.map((account) => (
                        <option key={account.number} value={account.number}>{account.bank}</option>
                    ))}
                </select>
                {errors.account && (
                    <div className="invalid-feedback d-block">{errors.account}</div>
                )}
            </div>
            <div className="col-12 mb-3">
                <label>Conta Destino</label>
                <select
                    className="form-control"
                    name="accountD"
                    value={form.accountD}
                    disabled={ (form.typeTransaction !== 'Transfer') }
                    onChange={onChange}
                >
                    {accounts.map((account) => (
                        <option key={account.number} value={account.number}>{account.bank}</option>
                    ))}
                </select>
                {errors.account && (
                    <div className="invalid-feedback d-block">{errors.account}</div>
                )}
            </div>
            <div className="text-center">
                <ButtonWithProgress
                    onClick={onSubmit}
                    disabled={pendingApiCall ? true : false}
                    pendingApiCall={pendingApiCall}
                    text="Salvar"
                />
            </div>
            {apiError && (<div className="alert alert-danger">{apiError}</div>)}
            <div className="text-center">
                <Link to="/transactions">Voltar</Link>
            </div>
        </div>
    );
};
export default TransactionFormPage;