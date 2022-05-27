import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from '../components/NavBar';
import HomePage from '../pages/HomePage';

import CategoryListPage from '../pages/CategoryListPage';
import ProductListPage from '../pages/ProductListPage';
import CategoryFormPage from '../pages/CategoryFormPage';
import ProductFormPage from '../pages/ProductFormPage';
import AccountListPage from '../pages/AccountListPage';
import AccountFormPage from '../pages/AccountFormPage';
import TransactionListPage from '../pages/TransactionListPage';
import TransactionFormPage from '../pages/TransactionFormPage';


const AuthenticatedRoutes = () => {
    
    return (
        <div>
            <NavBar />
            <Routes>
                <Route path='/' element={<HomePage />} />

                <Route path='/categories' element={<CategoryListPage />} />
                <Route path='/categories/new' element={<CategoryFormPage />} />
                <Route path='/categories/:id' element={<CategoryFormPage />} />

                <Route path='/products' element={<ProductListPage />} />
                <Route path='/products/new' element={<ProductFormPage />} />
                <Route path='/products/:id' element={<ProductFormPage />} />

                <Route path='/accounts' element={<AccountListPage />} />
                <Route path='/accounts/new' element={<AccountFormPage />} />
                <Route path='/accounts/:number' element={<AccountFormPage />} />

                <Route path='/transactions' element={<TransactionListPage />} />
                <Route path='/transactions/new' element={<TransactionFormPage />} />
                <Route path='/transactions/:id' element={<TransactionFormPage />} />

                <Route path='*' element={<HomePage />} />
            </Routes>
        </div>
    );
}

export default AuthenticatedRoutes;