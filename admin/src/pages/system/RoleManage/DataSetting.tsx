import { listSystemDepartment, SystemDepartmentResponse, SystemRoleDataRuleRequest, SystemRoleResponse, updateSystemRoleRule } from "@/api";
import { listSystemDataScopeRule, SystemDataScopeRuleResponse } from "@/api/system_data_scope_rule";
import CustomizedDialog from "@/components/CustomizedDialog";
import CustomizedMultipleSelectTree from "@/components/CustomizedMultipleSelectTree";
import { Box, Button, DialogProps, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import { forwardRef, ReactNode, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

interface TreeNode {
  id: string | number;
  parent_id: number; // 父菜单ID
  label: string;
  children: TreeNode[];
}

interface RoleDataSettingProps {
  onSubmit: () => void;
}

const RULE_ID_SPECIFY_DEPARTMENT = 5;

const RoleDataSetting = forwardRef(({ onSubmit }: RoleDataSettingProps, ref) => {

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [originRole, setOriginRole] = useState<SystemRoleResponse>();
  const [role, setRole] = useState<SystemRoleDataRuleRequest>({
    id: 0
  });
  const [rules, setRules] = useState<SystemDataScopeRuleResponse[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  useImperativeHandle(ref, () => ({
    show(role: SystemRoleResponse) {
      setOriginRole(role);
      setRole(role);
      initSelectedItems(role);
      initRules();
      initDepartments();
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
    setSelectedItems([]);
  }

  const initSelectedItems = async (role: SystemRoleResponse) => {
    if (role.data_scope_rule_id == RULE_ID_SPECIFY_DEPARTMENT && role.data_scope_department_ids) {
      setSelectedItems(role.data_scope_department_ids.split(','));
    }
  }

  const initRules = async () => {
    const result = await listSystemDataScopeRule();
    setRules(result);
  }

  const initDepartments = async () => {
    const result = await listSystemDepartment();
    const root = findRoot(result);
    const tree = buildTree(result, root?.parent_id);
    setTreeData(tree);
  }

  const findRoot = (list: SystemDepartmentResponse[]): SystemDepartmentResponse | undefined => {
    const ids = list.map(item => item.id);
    const parentIds = list.map(item => item.parent_id);
    const rootIds = parentIds.filter(id => ids.indexOf(id) < 0);
    if (rootIds.length > 0) {
      const rootId = rootIds[0];
      return list.filter(item => rootId === item.parent_id)[0];
    }
    return undefined;
  }

  const buildTree = (list: SystemDepartmentResponse[], rootParentId: number | undefined): TreeNode[] => {
    const map: { [key: string]: TreeNode } = {};
    const tree: TreeNode[] = [];

    // Create a map for quick lookup
    for (const item of list) {
      map[item.id] = {
        id: String(item.id),
        parent_id: item.parent_id,
        label: item.name,
        children: [],
      };
    }

    // Build the tree structure
    for (const item of list) {
      if (item.parent_id === rootParentId) {
        tree.push(map[item.id]);
      } else if (map[item.parent_id]) {
        map[item.parent_id].children.push(map[item.id]);
      }
    }

    return tree;
  }

  const handleSubmit = async () => {
    if (!role) {
      return;
    }

    const roleRule: SystemRoleDataRuleRequest = {
      id: role.id,
      data_scope_rule_id: role.data_scope_rule_id,
      data_scope_department_ids: selectedItems.join(','),
    }
    await updateSystemRoleRule(roleRule);
    handleClose();
    onSubmit();
  };

  const handleRuleChange = (e: SelectChangeEvent<number>, _child: ReactNode) => {
    const { name, value } = e.target;
    setRole(prev => ({
      ...prev,
      [name]: value
    }));

    switch (value) {
      case RULE_ID_SPECIFY_DEPARTMENT:
        // 指定部门数据权限

        break;
      default:
        setSelectedItems([]);
    }
  }

  const handleSelectedItemsChange = (_event: React.SyntheticEvent | null, itemIds: string[]) => {
    setSelectedItems(itemIds);
  }

  return (
    <CustomizedDialog
      open={open}
      onClose={handleClose}
      title={t('page.role.operate.data')}
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
            <Box>{t('global.page.role')}{t('common.title.name')}</Box>
            <Box>{originRole && originRole.name}</Box>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Box>{t('global.page.role')}{t('common.title.code')}</Box>
            <Box>{originRole && originRole.code}</Box>
          </Stack>
        </FormControl>
        <FormControl sx={{ mt: 3, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
          <InputLabel required size="small" id="rule-select-label">{t("page.role.operate.data")}</InputLabel>
          <Select
            required
            size="small"
            classes={{ select: 'CustomSelectSelect' }}
            labelId="rule-select-label"
            name="data_scope_rule_id"
            value={role && role.data_scope_rule_id}
            onChange={handleRuleChange}
            label={t("page.role.operate.data")}
          >
            {rules.map(item => (<MenuItem key={'rule-id-' + item.id} value={item.id}>{item.name}</MenuItem>))}
          </Select>
        </FormControl>
        {role.data_scope_rule_id == RULE_ID_SPECIFY_DEPARTMENT &&
          <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
            <CustomizedMultipleSelectTree
              required
              expandToSelected
              name='data_scope_department_ids'
              size="small"
              label={t('page.role.title.data.scope.department')}
              treeData={treeData}
              value={selectedItems}
              onSelectedItemsChange={handleSelectedItemsChange}
            />
          </FormControl>}
      </Box>
    </CustomizedDialog>
  )
});

export default RoleDataSetting;