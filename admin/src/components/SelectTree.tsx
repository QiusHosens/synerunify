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
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useTranslation } from 'react-i18next';

interface TreeNode {
  id: string | number;
  label: string;
  children?: TreeNode[];
}

interface SelectTreeProps {
  required?: boolean;
  name: string;
  size?: 'small' | 'medium';
  label: string;
  treeData: TreeNode[];
  expandToSelected: boolean;
  onChange: (name: string, node: TreeNode) => void;
  value: string | number;
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

const SelectTree = ({ required, name, size, label, treeData, expandToSelected, onChange, value, ...props }: SelectTreeProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
      const ids = getParentIds(treeData, value as string);
      ids.push(value.toString());
      setExpandedItems(ids);
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
    setSearchTerm('');
  };

  const handleSelect = (node: TreeNode) => {
    onChange(name, node);
    setOpen(false);
    setSearchTerm('');
  };

  const handleExpandedItemsChange = (event: React.SyntheticEvent, itemIds: string[]) => {
    setExpandedItems(itemIds);
  }

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
        key={node.id.toString()}
        itemId={node.id.toString()}
        // label={node.label}
        // onClick={(e: React.MouseEvent) => handleSelect(e, node.id)}
        label={
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => handleSelect(node)}
          >
            {node.label}
          </div>
        }
      >
        {node.children && renderTree(node.children)}
      </TreeItem>
    ));
  };

  return (
    <StyledFormControl>
      <InputLabel size={size}>{label}</InputLabel>
      <Select
        required={required}
        size={size}
        // labelId="custom-select-tree-label"
        ref={anchorRef}
        open={false}
        onClick={handleToggle}
        value={value}
        label={label}
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
        style={{ width: selectWidth ? `${selectWidth}px` : 'auto' }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            elevation={3}
            sx={{
              p: 1,
            }}
          >
            <TextField
              size={size}
              variant="outlined"
              placeholder={t('global.condition.keyword')}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              sx={{ mb: 1 }}
            />
            <SimpleTreeView
              expandedItems={expandedItems}
              onExpandedItemsChange={handleExpandedItemsChange}
              {...props}
            // defaultCollapseIcon={<ExpandMoreIcon />}
            // defaultExpandIcon={<ChevronRightIcon />}
            >
              {renderTree(filteredData)}
            </SimpleTreeView>
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

const getParentIds = (tree: TreeNode[], targetId: string | number): string[] => {
  // 存储结果的路径
  const result: string[] = [];

  // 递归查找函数
  const findPath = (nodes: TreeNode[], id: string | number): boolean => {
    for (const node of nodes) {
      // 如果当前节点就是要找的节点
      if (node.id === id) {
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

export default SelectTree;