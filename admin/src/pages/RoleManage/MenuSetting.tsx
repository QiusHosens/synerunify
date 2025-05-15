import { listMenu, SystemMenuResponse, SystemRoleResponse, updateRoleMenu } from "@/api";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, FormControl } from "@mui/material";
import { RichTreeView, SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

interface TreeNode {
  id: string | number;
  parent_id: number; // 父菜单ID
  label: string;
  children: TreeNode[];
}

const RoleMenuSetting = forwardRef(({ }, ref) => {

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [selectionPropagation, setSelectionPropagation] = useState<{ parents: boolean, descendants: boolean }>({
    parents: true,
    descendants: true,
  });

  const [menuTreeData, setMenuTreeData] = useState<TreeNode[]>([]);

  useImperativeHandle(ref, () => ({
    show(role: SystemRoleResponse) {
      initMenus();

      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const reset = () => {

  }

  const handleSubmit = async () => {
    // await updateRoleMenu();
    handleClose();
  };

  const initMenus = async () => {
    const result = await listMenu();
    const tree = buildMenuTree(result);
    setMenuTreeData(tree);
  }

  const buildMenuTree = (list: SystemMenuResponse[]): TreeNode[] => {
    const map: { [key: string]: TreeNode } = {};
    const tree: TreeNode[] = [];

    // Create a map for quick lookup
    for (const item of list) {
      map[item.id] = {
        id: item.id,
        parent_id: item.parent_id,
        label: item.name,
        children: [],
      };
    }

    // Build the tree structure
    for (const item of list) {
      if (item.parent_id === 0) {
        tree.push(map[item.id]);
      } else if (map[item.parent_id]) {
        map[item.parent_id].children.push(map[item.id]);
      }
    }

    return tree;
  }

  const renderTree = (nodes: TreeNode[]) => {
    return nodes.map((node) => (
      <TreeItem
        key={node.id.toString()}
        itemId={node.id.toString()}
        label={
          <div>
            {node.label}
          </div>
        }
      >
        {node.children && renderTree(node.children)}
      </TreeItem>
    ));
  };

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{t('global.operate.add')}{t('global.page.role')}</DialogTitle>
      <DialogContent>
        <Box
          noValidate
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            m: 'auto',
            width: 'fit-content',
          }}
        >
          <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
            <RichTreeView
              items={menuTreeData}
              checkboxSelection
              multiSelect
              selectionPropagation={selectionPropagation}
            // defaultExpandedItems={['8', '12']}
            />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
        <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
      </DialogActions>
    </Dialog >
  )
});

export default RoleMenuSetting;