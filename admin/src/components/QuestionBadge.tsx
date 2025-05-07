import React from 'react';
import { Badge, Tooltip } from '@mui/material';

interface QuestionBadgeProps {
  title: string;
  children: React.ReactNode
}

const QuestionBadge = ({ title, children }: QuestionBadgeProps) => {
  return (
    <Badge
      badgeContent={
        <Tooltip title={title} placement='auto' arrow>
          <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ?
          </span>
        </Tooltip>
      }
      color="primary"
      sx={{
        '& .MuiBadge-badge': {
          fontSize: '0.75rem',
          minWidth: '16px',
          height: '16px',
          padding: '0 4px',
        },
      }}
    >
      {children}
    </Badge>
  );
};

export default QuestionBadge;