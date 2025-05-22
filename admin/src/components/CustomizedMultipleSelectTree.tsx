import React, { useState, useRef, useEffect } from 'react';
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
  OutlinedInput,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomizedTag from './CustomizedTag';
import { RichTreeView, TreeViewSelectionPropagation } from '@mui/x-tree-view';

interface TreeNode {
  id: string | number;
  label: string;
  children?: TreeNode[];
}

interface CustomizedMultipleSelectTreeProps {
  required?: boolean;
  name: string;
  size?: 'small' | 'medium';
  label: string;
  treeData: TreeNode[];
  expandToSelected: boolean;
  onSelectedItemsChange: (event: React.SyntheticEvent | null, itemIds: string[]) => void;
  value: string[];
  sx?: SxProps<Theme>;
  [key: string]: any; // 允许其他 SimpleTreeView 组件支持的 props
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

const CustomizedMultipleSelectTree = ({ required, name, size, label, treeData, expandToSelected, onSelectedItemsChange, value, ...props }: CustomizedMultipleSelectTreeProps) => {
  const { t } = useTranslation();
  const [selectionPropagation] = useState<TreeViewSelectionPropagation>({
    parents: true,
    descendants: true,
  });

  const [open, setOpen] = useState(false);
  const [selectWidth, setSelectWidth] = useState<number | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const anchorRef = useRef<HTMLDivElement>(null);

  // Update selectWidth when the component mounts or size changes
  useEffect(() => {
    if (anchorRef.current) {
      const width = anchorRef.current.getBoundingClientRect().width;
      setSelectWidth(width);
    }
    if (expandToSelected) {
      const expandIds: string[] = [];
      for (let id of value) {
        const ids = getParentIds(treeData, id);
        expandIds.concat(ids);
      }
      expandIds.concat(value);
      setExpandedItems(expandIds);
    }
  }, [size, expandToSelected]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  };

  const handleExpandedItemsChange = (itemIds: string[]) => {
    setExpandedItems(itemIds);
  }

  const handleSelectedItemsChange = (event: React.SyntheticEvent | null, itemIds: string[]) => {
    onSelectedItemsChange(event, itemIds);
  }

  return (
    <StyledFormControl>
      <InputLabel required={required} size={size} id="custom-multiple-select-tree-label">{label}</InputLabel>
      <Select
        required={required}
        size={size}
        labelId="custom-multiple-select-tree-label"
        ref={anchorRef}
        open={false}
        onClick={handleToggle}
        value={value}
        label={label}
        multiple
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => {
          const selectedNodes = findNodeByIds(treeData, selected);
          console.log('selected nodes', selected, treeData, selectedNodes);
          return (<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selectedNodes.map((node) => (
              <CustomizedTag label={node.label} />
            ))}
          </Box>)
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
        style={{ width: selectWidth ? `${selectWidth}px` : 'auto' }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            elevation={3}
            sx={{
              p: 1,
            }}
          >
            <RichTreeView
              items={treeData}
              selectedItems={value}
              checkboxSelection
              multiSelect
              expandedItems={expandedItems}
              onExpandedItemsChange={(e, items) => handleExpandedItemsChange(items)}
              selectionPropagation={selectionPropagation}
              onSelectedItemsChange={handleSelectedItemsChange}
            />
          </Paper>
        </ClickAwayListener>
      </StyledPopper>
    </StyledFormControl>
  );
};

const findNodeById = (nodes: TreeNode[], id: string | number): TreeNode | null => {
  for (const node of nodes) {
    if (node.id == id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

const findNodeByIds = (nodes: TreeNode[], ids: string[] | number[]): TreeNode[] => {
  const result: TreeNode[] = [];
  for (const id of ids) {
    const node = findNodeById(nodes, id);
    if (node != null) {
      result.push(node);
    }
  }
  return result;
};

const getParentIds = (tree: TreeNode[], targetId: string | number): string[] => {
  // 存储结果的路径
  const result: string[] = [];

  // 递归查找函数
  const findPath = (nodes: TreeNode[], id: string | number): boolean => {
    for (const node of nodes) {
      // 如果当前节点就是要找的节点
      if (node.id == id) {
        return true;
      }

      // 如果有子节点，继续递归查找
      if (node.children) {
        if (findPath(node.children, id)) {
          // 找到目标节点后，将当前节点id添加到结果
          result.unshift(node.id.toString());
          return true;
        }
      }
    }
    return false;
  }

  // 开始查找
  findPath(tree, targetId);

  return result;
}

export default CustomizedMultipleSelectTree;