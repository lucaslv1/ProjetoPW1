import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ButtonWithProgress from '../components/ButtonWithProgress';
import Input from '../components/input';
import AccountService from '../services/AccountService';
import UserService from '../services/UserService';


export const AccountFormPage = () => {
    const [form, setForm] = useState({
        number: null,
        agency: null,
        bank: '',
        type: null,
        user: null
    });
    const [errors, setErrors] = useState({});
    const [pendingApiCall, setPendingApiCall] = useState(false);
    const [apiError, setApiError] = useState();
    const [users, setUsers] = useState([]);

    const navigate = useNavigate();
    const { number } = useParams();

    useEffect(() => {
        UserService.findAll().then((response) => {
            setUsers(response.data);
            if (number) {
                AccountService.findOne(number).then((response) => {
                    if (response.data) {
                        setForm({
                            number: response.data.number,
                            agency: response.data.agency,
                            bank: response.data.bank,
                            type: response.data.type,
                            user: response.data.user.id
                        });
                        setApiError();
                    } else {
                        setApiError('Falha ao carregar a conta');
                    }
                }).catch((erro) => {
                    setApiError('Falha ao carregar a conta');
                });

                if (form.user == null) {
                    setForm((previousForm) => {
                        return {
                            ...previousForm,
                            user: response.data[0].id,
                        };
                    });
                }
            }
            setApiError();
        }).catch((erro) => {
            setApiError('Falha ao carregar a combo de usuarios.');
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
        const account = {
            number: form.number,
            agency: form.agency,
            bank: form.bank,
            type: form.type,
            user: { id: form.user }
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
                <label>Banco</label>
                <textarea
                    className="form-control"
                    name="bank"
                    placeholder="Informe o banco"
                    value={form.bank}
                    onChange={onChange}
                ></textarea>
                {errors.bank && (
                    <div className="invalid-feedback d-block">{errors.bank}</div>
                )}
            </div>
            <div className="col-12 mb-3">
                <Input
                    name="type"
                    label="Tipo"
                    placeholder="Informe o tipo"
                    value={form.type}
                    onChange={onChange}
                    hasError={errors.type && true}
                    error={errors.type}
                />
            </div>
            <div className="col-12 mb-3">
                <label>Usuario</label>
                <select
                    className="form-control"
                    name="user"
                    value={form.user}
                    onChange={onChange}
                >
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
                {errors.user && (
                    <div className="invalid-feedback d-block">{errors.user}</div>
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