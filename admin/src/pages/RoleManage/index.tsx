import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableSystemRole, enableSystemRole, pageSystemRole, SystemRoleQueryCondition, SystemRoleResponse } from '@/api/role';
import RoleAdd from './Add';
import RoleEdit from './Edit';
import RoleDelete from './Delete';
import CustomizedDictTag from '@/components/CustomizedDictTag';
import CustomizedMore from '@/components/CustomizedMore';

export default function RoleManage() {
  const { t } = useTranslation();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<SystemRoleQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<SystemRoleResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const addRole = useRef(null);
  const editRole = useRef(null);
  const deleteRole = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: SystemRoleResponse) => {
      // 更新表格
      setRecords((prev) =>
        prev.map((r) =>
          r.id === data.id ? { ...r, status: checked ? 0 : 1 } : r
        )
      );

      if (checked) {
        await enableSystemRole(data.id);
      } else {
        await disableSystemRole(data.id);
      }
    },
    []
  );

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("page.role.title.name"), flex: 1, minWidth: 100 },
      {
        field: 'type',
        headerName: t("page.role.title.type"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <>
            <CustomizedDictTag type='role_type' value={params.row.type} />
          </>
        )
      },
      { field: 'code', headerName: t("page.role.title.code"), flex: 1, minWidth: 120 },
      { field: 'sort', headerName: t("page.role.title.sort"), flex: 1, minWidth: 60 },
      { field: 'data_scope_rule_id', sortable: false, headerName: t("page.role.title.data.scope.rule"), flex: 1, minWidth: 100 },
      { field: 'data_scope_department_ids', headerName: t("page.role.title.data.scope.department"), flex: 1, minWidth: 100 },
      { field: 'remark', headerName: t("page.role.title.remark"), flex: 1, minWidth: 100 },
      {
        field: 'status',
        sortable: false,
        headerName: t("page.role.title.status"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            <Switch name="status" checked={!params.row.status} onChange={(event, checked) => handleStatusChange(event, checked, params.row)} />
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
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              size="small"
              variant='customOperate'
              title={t('page.role.operate.edit')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />
            <CustomizedMore>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Button
                  size="small"
                  variant='customOperate'
                  title={t('page.role.operate.menu')}
                  startIcon={<EditIcon />}
                  onClick={() => handleClickOpenMenu(params.row.type_id)}
                />
                <Button
                  sx={{ mt: 1 }}
                  size="small"
                  variant='customOperate'
                  title={t('page.role.operate.data')}
                  startIcon={<EditIcon />}
                  onClick={() => handleClickOpenData(params.row.type_id)}
                />
                {params.row.type == 1 && <Button
                  sx={{ mt: 1, color: 'error.main' }}
                  size="small"
                  variant='customOperate'
                  title={t('page.role.operate.delete')}
                  startIcon={<DeleteIcon />}
                  onClick={() => handleClickOpenDelete(params.row)}
                />}
              </Box>
            </CustomizedMore>
          </Box>
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
    (deleteRole.current as any).show(role);
  };

  const handleClickOpenData = (role: SystemRoleResponse) => {
    (deleteRole.current as any).show(role);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    setCondition((prev) => ({ ...prev, ...model[0] } as SystemRoleQueryCondition));
  };

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        <Button variant="customContained" onClick={handleClickOpenAdd}>
          {t('global.operate.add')}
        </Button>
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
    </Box>
  );
}