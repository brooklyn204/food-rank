import { useState } from 'react';
import './ExpandableBox.css'; // Import the CSS

export default function ExpandableBox({ title, children }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="expandable-box" >
      {/* Top Bar */}
      <div className="box-header" onClick={() => setExpanded(!expanded)} >
        <span className="box-title">{title}</span>
        <span className="box-icon">{expanded ? '–' : '+'}</span>
      </div>

      {/* Expandable Content */}
      <div className={`box-content ${expanded ? 'expanded' : ''}`}>
        {children}
      </div>
    </div>
  );
}