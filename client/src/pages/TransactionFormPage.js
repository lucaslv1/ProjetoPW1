import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ButtonWithProgress from '../components/ButtonWithProgress';
import Input from '../components/input';
import AccountService from '../services/AccountService';
import TransactionService from '../services/TransactionService';
import moment from 'moment';

const dateNow = () => {
    const formatDate = moment().format('YYYY-MM-DD');
    return formatDate;
  }

export const TransactionFormPage = () => {
    const [form, setForm] = useState({
        id: null,
        value: null,
        dueDate: dateNow(),
        category: '',
        description: '',
        typeTransaction: 'Withdraw',
        account: null,
        accountD: null,
        installments: '1'
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
                            accountD: response.data.account.number,
                            installments: response.data.installments
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
          accountD: (form.accountD != null ? { number: form.accountD } : null),
          installments: form.installments,
          // valueCredit: (form.typeTransaction === "CreditPayment" && form.installments > 1) ? form.value / form.installments : form.value
        };
        setPendingApiCall(true);
        TransactionService.save(transaction)
          .then((response) => {
            setPendingApiCall(false);
            navigate("/transactions");
          })
          .catch((error) => {
            if (error.response.data && error.response.data.validationErrors) {
              setErrors(error.response.data.validationErrors);
            } else {
              setApiError("Falha ao salvar transação.");
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
                    <option key="Withdraw" value="Withdraw">
                        Saque
                    </option>
                    <option key="Deposit" value="Deposit">
                        Deposito
                    </option>
                    <option key="Payment" value="Payment">
                        Pagamento
                    </option>
                    <option key="CreditPayment" value="CreditPayment">
                        Pagamento no Credito
                    </option>
                    <option key="DebitPayment" value="DebitPayment">
                        Pagamento no Debito
                    </option>
                    <option key="Transfer" value="Transfer">
                        Transferencia
                    </option>
                    <option key="Pix" value="Pix">
                        Pix
                    </option>
                </select>
                {errors.typeTransaction && (
                <div className="invalid-feedback d-block">
                    {errors.typeTransaction}
                </div>
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
                    disabled={ (form.typeTransaction === 'Withdraw' || form.typeTransaction === 'Deposit') }
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
                <label>Número de Parcelas</label>
                <select
                className="form-control"
                name="installments"
                value={form.installments}
                disabled={form.typeTransaction !== "CreditPayment"}
                onChange={onChange}
                >
                    <option key="1" value="1">
                        1x
                    </option>
                    <option key="2" value="2">
                        2x
                    </option>
                    <option key="3" value="3">
                        3x
                    </option>
                    <option key="4" value="4">
                        4x
                    </option>
                    <option key="5" value="5">
                        5x
                    </option>
                    <option key="6" value="6">
                        6x
                    </option>
                    <option key="7" value="7">
                        7x
                    </option>
                    <option key="8" value="8">
                        8x
                    </option>
                    <option key="9" value="9">
                        9x
                    </option>
                    <option key="10" value="10">
                        10x
                    </option>
                    <option key="11" value="11">
                        11x
                    </option>
                    <option key="12" value="12">
                        12x
                    </option>
                </select>
                {errors.installments && (
                <div className="invalid-feedback d-block">{errors.installments}</div>
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