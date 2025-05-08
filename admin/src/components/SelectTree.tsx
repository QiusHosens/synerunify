import React, { useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Popper,
  Paper,
  ClickAwayListener,
  SxProps,
  Theme,
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { OverridableStringUnion } from '@mui/types';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

interface SelectTreeProps {
  size: string;
  label: string;
  treeData: TreeNode[];
  onChange: (value: string) => void;
  value: string;
  sx?: SxProps<Theme>;
}

const StyledFormControl = styled(FormControl)(({ theme }: { theme: any }) => ({
  // minWidth: 200,
  // '& .MuiSelect-select': {
  //   padding: theme.spacing(1.5),
  // },
}));

const StyledPopper = styled(Popper)(({ theme }: { theme: any }) => ({
  zIndex: theme.zIndex.modal,
  // width: '300px !important',
  // maxHeight: '400px',
  // overflowY: 'auto',
  // backgroundColor: theme.palette.background.paper,
  // border: '1px solid',
  // borderColor: theme.palette.divider,
  // borderRadius: theme.shape.borderRadius,
}));

const SelectTree = ({ size, label, treeData, onChange, value }: SelectTreeProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
    setSearchTerm('');
  };

  const handleSelect = (event: React.MouseEvent, nodeId: string) => {
    onChange(nodeId);
    setOpen(false);
    setSearchTerm('');
  };

  const filterTree = (nodes: TreeNode[], term: string): TreeNode[] => {
    return nodes.reduce((acc: TreeNode[], node: TreeNode) => {
      const matches = node.label.toLowerCase().includes(term.toLowerCase());
      const children = node.children ? filterTree(node.children, term) : [];

      if (matches || children.length > 0) {
        acc.push({
          ...node,
          children,
        });
      }
      return acc;
    }, []);
  };

  const filteredData = searchTerm ? filterTree(treeData, searchTerm) : treeData;

  const renderTree = (nodes: TreeNode[]) => {
    return nodes.map((node) => (
      <TreeItem
        key={node.id}
        itemId={node.id}
        label={node.label}
        onClick={(e: React.MouseEvent) => handleSelect(e, node.id)}
      >
        {node.children && renderTree(node.children)}
      </TreeItem>
    ));
  };

  return (
    <StyledFormControl>
      <InputLabel>{label}</InputLabel>
      <Select
        size=''
        ref={anchorRef}
        open={false}
        onClick={handleToggle}
        value={value}
        renderValue={(selected) => {
          const selectedNode = findNodeById(treeData, selected as string);
          return selectedNode ? selectedNode.label : '';
        }}
      >
        <MenuItem value="" disabled>
          <em>None</em>
        </MenuItem>
      </Select>
      <StyledPopper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper elevation={3} sx={{
            p: 1,
          }}>
            <TextField
              size={size}
              variant="outlined"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            // sx={{ m: 1 }}
            />
            <SimpleTreeView
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            // sx={{ p: 1, minWidth: 250 }}
            >
              {renderTree(filteredData)}
            </SimpleTreeView>
          </Paper>
        </ClickAwayListener>
      </StyledPopper>
    </StyledFormControl>
  );
};

const findNodeById = (nodes: TreeNode[], id: string): TreeNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export default SelectTree;