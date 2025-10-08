// src/components/reports/ReportsTable.jsx
import styles from '../users/UserTable.module.css'; // Reuse table styles
import { Badge } from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export const ReportsTable = ({ reports }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Reported Item</th>
            <th>Type</th>
            <th>Reason</th>
            <th>Reported By</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report._id}>
              <td>
                {/* Link to the user or project profile on the MAIN site */}
                {report.reportedProject ? (
                  <a href={`http://localhost:5173/projects/${report.reportedProject._id}`} target="_blank" rel="noopener noreferrer">{report.reportedProject.title}</a>
                ) : (
                  <a href={`http://localhost:5173/users/${report.reportedUser._id}`} target="_blank" rel="noopener noreferrer">{report.reportedUser.name}</a>
                )}
              </td>
              <td><Badge text={report.reportedProject ? 'Project' : 'User'} /></td>
              <td>{report.reason}</td>
              <td>{report.reporter.name}</td>
              <td>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</td>
              <td className={styles.actions}>
                <button>Resolve</button>
                <button className={styles.deleteBtn}>Dismiss</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};