// src/pages/TransactionsPage.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePageTitle } from '../context/PageTitleContext';
import { fetchAllTransactions } from '../features/transactions/transactionSlice';
import { TransactionsTable } from '../components/transactions/TransactionsTable';
import styles from './UserManagementPage.module.css'; // Reuse existing page layout styles

export const TransactionsPage = () => {
  const dispatch = useDispatch();
  const { setTitle } = usePageTitle();

  const { transactions, status, error } = useSelector(state => state.transactions);

  useEffect(() => {
    setTitle('Transaction History');
    // Fetch transactions only if they haven't been fetched yet
    if (status === 'idle') {
      dispatch(fetchAllTransactions());
    }
  }, [status, dispatch, setTitle]);

  return (
    <div>
      {/* The h1 is now in the AdminHeader, set by usePageTitle */}
      
      {status === 'loading' && <p>Loading transactions...</p>}
      {status === 'failed' && <p className={styles.error}>Error: {error}</p>}
      {status === 'succeeded' && (
        transactions.length > 0 ? (
          <TransactionsTable transactions={transactions} />
        ) : (
          <p>No transactions have been recorded yet.</p>
        )
      )}
    </div>
  );
};