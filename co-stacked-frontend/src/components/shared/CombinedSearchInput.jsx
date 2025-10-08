// src/components/shared/CombinedSearchInput.jsx
import styles from './CombinedSearchInput.module.css';
import { Search, MapPin } from 'lucide-react';

export const CombinedSearchInput = ({ 
  searchValue, onSearchChange, 
  locationValue, onLocationChange,
  searchPlaceholder = "Search...",
  locationPlaceholder = "Location..."
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <Search className={styles.icon} size={20} />
        <input 
          type="text"
          placeholder={searchPlaceholder}
          className={styles.input}
          value={searchValue}
          onChange={onSearchChange}
        />
      </div>
      <div className={styles.separator}></div>
      <div className={styles.inputGroup}>
        <MapPin className={styles.icon} size={20} />
        <input 
          type="text"
          placeholder={locationPlaceholder}
          className={styles.input}
          value={locationValue}
          onChange={onLocationChange}
        />
      </div>
    </div>
  );
};