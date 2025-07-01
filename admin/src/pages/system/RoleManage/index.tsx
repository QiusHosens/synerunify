import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableSystemRole, enableSystemRole, pageSystemRole, SystemRoleQueryCondition, SystemRoleResponse } from '@/api/role';
import RoleAdd from './Add';
import RoleEdit from './Edit';
import RoleDelete from './Delete';
import CustomizedDictTag from '@/components/CustomizedDictTag';
import RoleMenuSetting from './MenuSetting';
import RoleDataSetting from './DataSetting';
import CustomizedTag from '@/components/CustomizedTag';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';

export default function RoleManage() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<SystemRoleQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<SystemRoleResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addRole = useRef(null);
  const editRole = useRef(null);
  const deleteRole = useRef(null);
  const roleMenuSetting = useRef(null);
  const roleDataSetting = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: SystemRoleResponse) => {
      if (checked) {
        await enableSystemRole(data.id);
      } else {
        await disableSystemRole(data.id);
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
    return (status && !hasOperatePermission('system:role:enable')) || (!status && !hasOperatePermission('system:role:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("common.title.name"), flex: 1, minWidth: 100 },
      {
        field: 'type',
        headerName: t("common.title.type"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <>
            <CustomizedDictTag type='role_type' value={params.row.type} />
          </>
        )
      },
      { field: 'code', headerName: t("common.title.code"), flex: 1, minWidth: 120 },
      { field: 'sort', headerName: t("common.title.sort"), flex: 1, minWidth: 60 },
      {
        field: 'data_scope_rule_name',
        sortable: false,
        filterable: false,
        headerName: t("page.role.title.data.scope.rule"),
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => (
          <>
            <CustomizedTag label={params.row.data_scope_rule_name} />
          </>
        )
      },
      { field: 'remark', headerName: t("common.title.remark"), flex: 1, minWidth: 100 },
      {
        field: 'status',
        sortable: false,
        headerName: t("common.title.status"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            <Switch name="status" checked={!params.row.status} disabled={statusDisabled(params.row.status)} onChange={(event, checked) => handleStatusChange(event, checked, params.row)} />
          </Box>
        ),
      },
      {
        field: 'actions',
        sortable: false,
        resizable: false,
        headerName: t("global.operate.actions"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <CustomizedAutoMore>
            {hasOperatePermission('system:role:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('page.role.operate.edit')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('system:role:menu') && <Button
              size="small"
              variant='customOperate'
              title={t('page.role.operate.menu')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenMenu(params.row)}
            />}
            {hasOperatePermission('system:role:data') && <Button
              size="small"
              variant='customOperate'
              title={t('page.role.operate.data')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenData(params.row)}
            />}
            {hasOperatePermission('system:role:delete') && params.row.type == 1 && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('page.role.operate.delete')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async (condition: SystemRoleQueryCondition) => {
    const result = await pageSystemRole(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addRole.current as any).show();
  }

  const handleClickOpenEdit = (role: SystemRoleResponse) => {
    (editRole.current as any).show(role);
  };

  const handleClickOpenDelete = (role: SystemRoleResponse) => {
    (deleteRole.current as any).show(role);
  };

  const handleClickOpenMenu = (role: SystemRoleResponse) => {
    (roleMenuSetting.current as any).show(role);
  };

  const handleClickOpenData = (role: SystemRoleResponse) => {
    (roleDataSetting.current as any).show(role);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    // console.log('sort model', model);
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as SystemRoleQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
      setFilterModel(model);
      if (model.items.length > 0) {
        setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as SystemRoleQueryCondition));
      }
    }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('system:role:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
        filterModel={filterModel}
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
      <RoleAdd ref={addRole} onSubmit={refreshData} />
      <RoleEdit ref={editRole} onSubmit={refreshData} />
      <RoleDelete ref={deleteRole} onSubmit={refreshData} />
      <RoleMenuSetting ref={roleMenuSetting} onSubmit={refreshData} />
      <RoleDataSetting ref={roleDataSetting} onSubmit={refreshData} />
    </Box>
  );
}