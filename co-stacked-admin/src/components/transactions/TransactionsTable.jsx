// src/components/transactions/TransactionsTable.jsx

import styles from './TransactionsTable.module.css';
import PropTypes from 'prop-types';

// Helper to format currency
const formatCurrency = (amountInCents) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amountInCents / 100);
};

// Helper to format dates
const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-ZA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

// --- THIS IS THE FIX ---
// The `export` keyword was missing from this line.
export const TransactionsTable = ({ transactions }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Yoco Charge ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id}>
              <td>
                <div className={styles.userCell}>
                  <span className={styles.userName}>{tx.userId?.name || 'N/A'}</span>
                  <span className={styles.userEmail}>{tx.userId?.email || 'N/A'}</span>
                </div>
              </td>
              <td className={styles.typeCell}>
                <span className={`${styles.badge} ${styles[tx.type]}`}>
                  {tx.type.replace('_', ' ')}
                </span>
              </td>
              <td>{formatCurrency(tx.amountInCents)}</td>
              <td>{formatDateTime(tx.createdAt)}</td>
              <td className={styles.chargeId}>{tx.yocoChargeId}</td>
              <td>
                <span className={`${styles.statusBadge} ${styles[tx.status]}`}>
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TransactionsTable.propTypes = {
  transactions: PropTypes.array.isRequired,
};