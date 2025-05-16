import { listMenu, SystemMenuResponse, SystemTenantPackageMenuRequest, SystemTenantPackageResponse, updateSystemTenantPackageMenu } from "@/api";
import CustomizedTag from "@/components/CustomizedTag";
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

interface TenantPackageMenuSettingProps {
  onSubmit: () => void;
}

const TenantPackageMenuSetting = forwardRef(({ onSubmit }: TenantPackageMenuSettingProps, ref) => {

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [selectionPropagation] = useState<TreeViewSelectionPropagation>({
    parents: true,
    descendants: true,
  });

  const [tenantPackage, setTenantPackage] = useState<SystemTenantPackageResponse>();
  const [menuTreeData, setMenuTreeData] = useState<TreeNode[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useImperativeHandle(ref, () => ({
    show(tenantPackage: SystemTenantPackageResponse) {
      setTenantPackage(tenantPackage);
      initMenus();
      initTenantPackageMenus(tenantPackage);
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
    if (!tenantPackage) {
      return;
    }
    const menuIds = '[' + selectedItems.join(',') + ']';
    const tenantPackageMenu: SystemTenantPackageMenuRequest = {
      id: tenantPackage.id,
      menu_ids: menuIds
    };
    await updateSystemTenantPackageMenu(tenantPackageMenu);
    handleClose();
    onSubmit();
  };

  const handleSelectedItemsChange = (event: React.SyntheticEvent | null, itemIds: string[]) => {
    setSelectedItems(itemIds);
  }

  const initMenus = async () => {
    const result = await listMenu();
    const tree = buildMenuTree(result);
    setMenuTreeData(tree);
  }

  const initTenantPackageMenus = (tenantPackage: SystemTenantPackageResponse) => {
    const result: number[] = JSON.parse(tenantPackage.menu_ids);
    const items = result.map(m => String(m));
    // console.log('items', items);
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
      <DialogTitle>{t('page.tenant.package.operate.menu')}</DialogTitle>
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
              <Box>{t('global.page.tenant.package')}{t('page.tenant.package.title.name')}</Box>
              <Box>{tenantPackage && <CustomizedTag label={tenantPackage.name} />}</Box>
            </Stack>
          </FormControl>
          <FormControl sx={{ mt: 2, minWidth: 120 }}>
            <Stack direction="row" spacing={2}>
              <Box>{t('page.tenant.package.operate.menu')}</Box>
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

export default TenantPackageMenuSetting;