import { getRoleMenu, listMenu, SystemMenuResponse, SystemRoleMenuRequest, SystemRoleResponse, updateRoleMenu } from "@/api";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, FormControl, Stack } from "@mui/material";
import { RichTreeView, TreeViewSelectionPropagation } from "@mui/x-tree-view";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

interface TreeNode {
  id: string;
  parent_id: number; // 父菜单ID
  label: string;
  children: TreeNode[];
}

const RoleMenuSetting = forwardRef(({ }, ref) => {

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [selectionPropagation] = useState<TreeViewSelectionPropagation>({
    parents: true,
    descendants: true,
  });

  const [role, setRole] = useState<SystemRoleResponse>();
  const [menuTreeData, setMenuTreeData] = useState<TreeNode[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useImperativeHandle(ref, () => ({
    show(role: SystemRoleResponse) {
      setRole(role);
      initMenus();
      initRoleMenus(role);
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
    if (!role) {
      return;
    }
    const menuIds = selectedItems.map(item => Number(item));
    const roleMenu: SystemRoleMenuRequest = {
      role_id: role.id,
      menu_id_list: menuIds
    };
    await updateRoleMenu(roleMenu);
    handleClose();
  };

  const handleSelectedItemsChange = (event: React.SyntheticEvent | null, itemIds: string[]) => {
    setSelectedItems(itemIds);
  }

  const initMenus = async () => {
    const result = await listMenu();
    const tree = buildMenuTree(result);
    setMenuTreeData(tree);
  }

  const initRoleMenus = async (role: SystemRoleResponse) => {
    const result = await getRoleMenu(role.id);
    const items = result.map(m => m.toString());
    setSelectedItems(items);
  }

  const buildMenuTree = (list: SystemMenuResponse[]): TreeNode[] => {
    const map: { [key: string]: TreeNode } = {};
    const tree: TreeNode[] = [];

    // Create a map for quick lookup
    for (const item of list) {
      map[item.id] = {
        id: item.id.toString(),
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

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{t('page.role.operate.menu')}</DialogTitle>
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
          <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiStack-root': { mt: 2, width: '200px' } }}>
            <Stack direction="row" spacing={2}>
              <Box>{t('global.page.role')}{t('page.role.title.name')}</Box>
              <Box>{role && role.name}</Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Box>{t('global.page.role')}{t('page.role.title.code')}</Box>
              <Box>{role && role.code}</Box>
            </Stack>
          </FormControl>
          <FormControl sx={{ mt: 2, minWidth: 120 }}>
            <Stack direction="row" spacing={2}>
              <Box>{t('page.role.operate.menu')}</Box>
              <Box
              // sx={{ p: 2, border: '1px solid rgba(0, 0, 0, 0.08)' }}
              >
                <RichTreeView
                  items={menuTreeData}
                  selectedItems={selectedItems}
                  checkboxSelection
                  multiSelect
                  selectionPropagation={selectionPropagation}
                  onSelectedItemsChange={handleSelectedItemsChange}
                />
              </Box>
            </Stack>
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