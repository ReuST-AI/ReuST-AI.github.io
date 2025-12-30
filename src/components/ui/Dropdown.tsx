/**
 * Dropdown/Accordion component
 * Collapsible section with header and content
 */

import React from 'react';
import styles from './Dropdown.module.css';

interface DropdownProps {
  title: string;
  description?: string;
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({
  title,
  description,
  isActive,
  onToggle,
  children,
}) => {
  return (
    <div className={`${styles.container} ${isActive ? styles.active : ''}`}>
      <h2 onClick={onToggle} title={description || ''}>
        {title}
      </h2>
      {isActive && <div className={styles.content}>{children}</div>}
    </div>
  );
};
