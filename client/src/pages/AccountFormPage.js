import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ButtonWithProgress from '../components/ButtonWithProgress';
import Input from '../components/input';
import AccountService from '../services/AccountService';


export const AccountFormPage = () => {
    const [form, setForm] = useState({
        number: null,
        agency: null,
        bank: '',
        typeAccount: null
    });
    const [errors, setErrors] = useState({});
    const [pendingApiCall, setPendingApiCall] = useState(false);
    const [apiError, setApiError] = useState();

    const navigate = useNavigate();
    const { number } = useParams();

    useEffect(() => {
            if (number) {
                AccountService.findOne(number).then((response) => {
                    if (response.data) {
                        setForm({
                            number: response.data.number,
                            agency: response.data.agency,
                            bank: response.data.bank,
                            typeAccount: response.data.typeAccount,
                            user: response.data.user.id
                        });
                        setApiError();
                    } else {
                        setApiError('Falha ao carregar a conta');
                    }
                }).catch((erro) => {
                    setApiError('Falha ao carregar a conta');
                });
            }
    }, [number]);

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
        const account = {
            number: form.number,
            agency: form.agency,
            bank: form.bank,
            typeAccount: form.typeAccount
        };
        setPendingApiCall(true);
        AccountService.save(account).then((response) => {
            setPendingApiCall(false);
            navigate('/accounts');
        }).catch((error) => {
            if (error.response.data && error.response.data.validationErrors) {
                setErrors(error.response.data.validationErrors);
            } else {
                setApiError('Falha ao salvar conta.');
            }
            setPendingApiCall(false);
        });
    };

    return (
        <div className="container">
            <h1 className="text-center">Cadastro de Conta</h1>
            <div className="col-12 mb-3">
                <Input
                    name="agency"
                    label="Agencia"
                    placeholder="Informe a agencia"
                    value={form.agency}
                    onChange={onChange}
                    hasError={errors.agency && true}
                    error={errors.agency}
                />
            </div>
            <div className="col-12 mb-3">
                <Input
                    name="bank"
                    label="Banco"
                    placeholder="Informe o banco"
                    value={form.bank}
                    onChange={onChange}
                    hasError={errors.bank && true}
                    error={errors.bank}
                />
            </div>
            <div className="col-12 mb-3">
                <label>Tipo</label>
                <select
                    className="form-control"
                    name="typeAccount"
                    value={form.typeAccount}
                    onChange={onChange}
                >
                    <option key="CC" value="CC">Conta Corrente</option>
                    <option key="CP" value="CP">Conta Poupanca</option>
                    <option key="C" value="C">Cartao de Credito</option>
                </select>
                {errors.type && (
                    <div className="invalid-feedback d-block">{errors.typeAccount}</div>
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
                <Link to="/accounts">Voltar</Link>
            </div>
        </div>
    );
};
export default AccountFormPage;