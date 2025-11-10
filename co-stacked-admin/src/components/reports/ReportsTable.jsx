// src/components/reports/ReportsTable.jsx

// --- 1. IMPORT its own dedicated stylesheet ---
import styles from './ReportsTable.module.css'; 
import { Badge } from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch } from 'react-redux';
import { updateReportStatus } from '../../features/reports/reportsSlice';
import PropTypes from 'prop-types'; // Import PropTypes

export const ReportsTable = ({ reports }) => {
  const dispatch = useDispatch();

  const handleUpdateStatus = (reportId, status) => {
    // A simple confirmation for a destructive action
    if (window.confirm(`Are you sure you want to mark this report as ${status}?`)) {
      dispatch(updateReportStatus({ reportId, status }));
    }
  };

  const getReportedItemInfo = (report) => {
    if (report.reportedProject) {
      return {
        type: 'Project',
        name: report.reportedProject.title || 'N/A',
        url: `/projects/${report.reportedProject._id}`, // Use relative app links
      };
    }
    if (report.reportedUser) {
      return {
        type: 'User',
        name: report.reportedUser.name || 'N/A',
        url: `/users/${report.reportedUser._id}`, // Use relative app links
      };
    }
    return {
      type: 'Support Ticket',
      name: report.reason, // The "subject" for support tickets
      url: null,
    };
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Item / Subject</th>
            <th>Type</th>
            <th>Reason / Details</th>
            <th>Reported By</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => {
            const reportedItem = getReportedItemInfo(report);
            return (
              <tr key={report._id}>
                {/* --- 2. ADD data-label attributes to each cell --- */}
                <td data-label="Item / Subject">
                  {reportedItem.url ? (
                    <a href={reportedItem.url} target="_blank" rel="noopener noreferrer" className={styles.itemNameLink}>
                      {reportedItem.name}
                    </a>
                  ) : (
                    <span>{reportedItem.name}</span>
                  )}
                </td>
                <td data-label="Type"><Badge text={reportedItem.type} /></td>
                <td data-label="Reason / Details" className={styles.commentCell}>
                  {reportedItem.type === 'Support Ticket' ? report.comment : report.reason}
                </td>
                <td data-label="Reported By">{report.reporter.name}</td>
                <td data-label="Date">{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</td>
                <td data-label="Actions" className={styles.actionsCell}>
                  <button onClick={() => handleUpdateStatus(report._id, 'resolved')}>
                    Resolve
                  </button>
                  <button onClick={() => handleUpdateStatus(report._id, 'dismissed')} className={styles.dismissBtn}>
                    Dismiss
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Add PropTypes for validation
ReportsTable.propTypes = {
  reports: PropTypes.array.isRequired,
};