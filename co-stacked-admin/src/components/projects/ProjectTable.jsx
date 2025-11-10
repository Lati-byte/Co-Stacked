// src/components/projects/ProjectTable.jsx

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProject } from '../../features/projects/projectManagementSlice';
// --- 1. IMPORT its own dedicated stylesheet ---
import styles from './ProjectTable.module.css';

// Import all necessary UI components
import { Badge } from '../ui/Badge';
import { ConfirmationModal } from '../shared/ConfirmationModal';
import { EditProjectModal } from './EditProjectModal';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

export const ProjectTable = ({ projects }) => {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.projectManagement);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      dispatch(deleteProject(projectToDelete._id));
    }
    setDeleteModalOpen(false);
    setProjectToDelete(null);
  };
  
  const handleEditClick = (project) => {
    setProjectToEdit(project);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to permanently delete the project "${projectToDelete?.title}"?`}
        confirmText="Yes, Delete Project"
      />
      <EditProjectModal
        project={projectToEdit}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Founder</th>
              <th>Stage</th>
              <th>Date Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project._id}>
                {/* --- 2. ADD data-label attributes to each cell --- */}
                <td data-label="Title" className={styles.titleCell}>{project.title || 'Untitled'}</td>
                <td data-label="Founder">{project.founderId?.name || <span className={styles.deletedUser}>[Deleted User]</span>}</td>
                <td data-label="Stage"><Badge text={project.stage || 'N/A'} variant="secondary" /></td>
                <td data-label="Date Posted">{project.createdAt ? format(new Date(project.createdAt), 'dd MMM, yyyy') : 'N/A'}</td>
                <td data-label="Actions" className={styles.actionsCell}>
                  <button onClick={() => handleEditClick(project)}>Edit</button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteClick(project)}
                    disabled={status === 'loading' && projectToDelete?._id === project._id}
                  >
                    {status === 'loading' && projectToDelete?._id === project._id 
                      ? <Loader2 size={14} className={styles.loader} />
                      : 'Delete'
                    }
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

ProjectTable.propTypes = {
  projects: PropTypes.array.isRequired,
};