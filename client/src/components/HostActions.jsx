import React from 'react';
import { CheckCircle, Cancel } from '@mui/icons-material';

const HostActions = ({ bookingId, status, onStatusUpdate }) => {
  const handleApprove = () => {
    onStatusUpdate(bookingId, 'confirmed');
  };

  const handleReject = () => {
    onStatusUpdate(bookingId, 'cancelled');
  };

  if (status !== 'pending') {
    return null;
  }

  return (
    <div className="host-actions">
      <button 
        className="approve-btn"
        onClick={handleApprove}
        title="Approve Booking"
      >
        <CheckCircle sx={{ fontSize: '16px' }} />
        Approve
      </button>
      <button 
        className="reject-btn"
        onClick={handleReject}
        title="Reject Booking"
      >
        <Cancel sx={{ fontSize: '16px' }} />
        Reject
      </button>
    </div>
  );
};

export default HostActions; 