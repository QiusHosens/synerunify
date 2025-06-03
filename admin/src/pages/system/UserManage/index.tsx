import { Box, Button, FormControl, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableSystemUser, enableSystemUser, listSystemDepartment, pageSystemUser, SystemDepartmentResponse, SystemUserQueryCondition, SystemUserResponse } from '@/api';
import UserAdd from './Add';
import UserEdit from './Edit';
import UserDelete from './Delete';
import CustomizedMore from '@/components/CustomizedMore';
import SelectTree from '@/components/SelectTree';
import UserResetPassword from './ResetPassword';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';

interface TreeNode {
  id: string | number;
  code: string;
  parent_id: number; // 父菜单ID
  label: string;
  children: TreeNode[];
}

export default function UserManage() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<SystemUserQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<SystemUserResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | number>(0);


  const addUser = useRef(null);
  const editUser = useRef(null);
  const deleteUser = useRef(null);
  const resetPasswordUser = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: SystemUserResponse) => {
      if (checked) {
        await enableSystemUser(data.id);
      } else {
        await disableSystemUser(data.id);
      }

      // 更新表格
      setRecords((prev) =>
        prev.map((r) =>
          r.id === data.id ? { ...r, status: checked ? 0 : 1 } : r
        )
      );
    },
    []
  );

  const statusDisabled = (status: number): boolean => {
    return (status && !hasOperatePermission('system:user:enable')) || (!status && !hasOperatePermission('system:user:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'nickname', headerName: t("page.user.title.nickname"), flex: 1, minWidth: 100 },
      { field: 'username', headerName: t("page.user.title.username"), flex: 1, minWidth: 100 },
      { field: 'department_name', headerName: t("page.user.title.department.name"), flex: 1, minWidth: 60 },
      { field: 'role_name', headerName: t("page.user.title.role.name"), flex: 1, minWidth: 100 },
      { field: 'mobile', headerName: t("page.user.title.mobile"), flex: 1, minWidth: 100 },
      {
        field: 'status',
        sortable: false,
        headerName: t("page.user.title.status"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            <Switch name="status" checked={!params.row.status} disabled={statusDisabled(params.row.status)} onChange={(event, checked) => handleStatusChange(event, checked, params.row)} />
          </Box>
        ),
      },
      { field: 'create_time', headerName: t("page.user.title.create.time"), flex: 1, minWidth: 180 },
      {
        field: 'actions',
        sortable: false,
        resizable: false,
        headerName: t("global.operate.actions"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <CustomizedAutoMore>
            {hasOperatePermission('system:user:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('page.user.operate.edit')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('system:user:reset') && <Button
              size="small"
              variant='customOperate'
              title={t('page.user.operate.reset')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenReset(params.row)}
            />}
            {hasOperatePermission('system:user:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('page.user.operate.delete')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async (condition: SystemUserQueryCondition) => {
    const result = await pageSystemUser(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addUser.current as any).show();
  }

  const handleClickOpenEdit = (user: SystemUserResponse) => {
    (editUser.current as any).show(user);
  };

  const handleClickOpenDelete = (user: SystemUserResponse) => {
    (deleteUser.current as any).show(user);
  };

  const handleClickOpenReset = (user: SystemUserResponse) => {
    (resetPasswordUser.current as any).show(user);
  };

  useEffect(() => {
    initDepartments();
  }, []);

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, _details: GridCallbackDetails) => {
    setSortModel(model);
    setCondition((prev) => ({ ...prev, ...model[0] } as SystemUserQueryCondition));
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    console.log('filter model', model);
    setFilterModel(model);
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  const handleChange = (name: string, node: TreeNode) => {
    setSelectedDepartmentId(node.id);
    setCondition((prev) => ({ ...prev, [name]: node.code } as SystemUserQueryCondition));
  };

  const initDepartments = async () => {
    const result = await listSystemDepartment();
    const root = findRoot(result);
    if (root) {
      setSelectedDepartmentId(root.id);
    }
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
        id: item.id,
        code: item.code,
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

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <FormControl sx={{ minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
            <SelectTree
              expandToSelected
              name='department_code'
              size="small"
              label={t('page.user.title.department.name')}
              treeData={treeData}
              value={selectedDepartmentId}
              onChange={(name, node) => handleChange(name, node as TreeNode)}
            />
          </FormControl>
        </Box>
        {hasOperatePermission('system:user:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
          {t('global.operate.add')}
        </Button>}
      </Box>
      <DataGrid
        rowCount={total}
        rows={records}
        columns={columns}
        getRowId={(row) => row.id}
        pagination
        paginationMode="server"
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        onFilterModelChange={handleFilterModelChange}
        pageSizeOptions={[10, 20, 50, 100]}
        paginationModel={{ page: condition.page - 1, pageSize: condition.size }}
        onPaginationModelChange={(model) => {
          setCondition((prev) => ({
            ...prev,
            page: model.page + 1,
            size: model.pageSize,
          }));
        }}
      />
      <UserAdd ref={addUser} onSubmit={refreshData} />
      <UserEdit ref={editUser} onSubmit={refreshData} />
      <UserDelete ref={deleteUser} onSubmit={refreshData} />
      <UserResetPassword ref={resetPasswordUser} onSubmit={refreshData} />
    </Box>
  );
}