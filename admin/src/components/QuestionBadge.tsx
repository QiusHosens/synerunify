import React from 'react';
import { Badge, Tooltip } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface QuestionBadgeProps {
  title: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const QuestionBadge = ({ title, children, sx }: QuestionBadgeProps) => {
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
      className='customQuestionBadge'
      variant='customQuestion'
      sx={{
        ...sx
      }}
    >
      {children}
    </Badge>
  );
};

export default QuestionBadge;