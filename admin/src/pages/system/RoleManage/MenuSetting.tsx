import { getRoleMenu, listMenu, SystemMenuResponse, SystemRoleMenuRequest, SystemRoleResponse, updateRoleMenu } from "@/api";
import CustomizedDialog from "@/components/CustomizedDialog";
import { getSelectedIds } from "@/utils/treeUtils";
import { Box, Button, DialogProps, FormControl, Stack } from "@mui/material";
import { RichTreeView, TreeViewSelectionPropagation } from "@mui/x-tree-view";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

interface TreeNode {
  id: string;
  parent_id: number; // 父菜单ID
  label: string;
  children: TreeNode[];
}

interface RoleMenuSettingProps {
  onSubmit: () => void;
}

const RoleMenuSetting = forwardRef(({ onSubmit }: RoleMenuSettingProps, ref) => {

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
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
    const menuIds = getSelectedIds(selectedItems, menuTreeData).map(item => Number(item));
    const roleMenu: SystemRoleMenuRequest = {
      role_id: role.id,
      menu_id_list: menuIds
    };
    await updateRoleMenu(roleMenu);
    handleClose();
    onSubmit();
  };

  const handleSelectedItemsChange = (_event: React.SyntheticEvent | null, itemIds: string[]) => {
    // console.log('selected item change', itemIds, getSelectedIds(itemIds, menuTreeData).map(item => Number(item)));
    setSelectedItems(itemIds);
  }

  const initMenus = async () => {
    const result = await listMenu();
    const tree = buildMenuTree(result);
    setMenuTreeData(tree);
  }

  const initRoleMenus = async (role: SystemRoleResponse) => {
    const result = await getRoleMenu(role.id);
    const items = result.map(m => String(m));
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
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('page.role.operate.menu')}
      maxWidth={maxWidth}
      actions={
        <>
          <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
        </>
      }
    >
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
    </CustomizedDialog>
  )
});

export default RoleMenuSetting;