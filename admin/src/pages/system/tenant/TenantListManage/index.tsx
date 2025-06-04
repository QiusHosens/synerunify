import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableSystemTenant, enableSystemTenant, pageSystemTenant, SystemTenantQueryCondition, SystemTenantResponse } from '@/api';
import TenantAdd from './Add';
import TenantEdit from './Edit';
import TenantDelete from './Delete';
import CustomizedTag from '@/components/CustomizedTag';
import { useHomeStore } from '@/store';

export default function TenantManage() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<SystemTenantQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<SystemTenantResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addTenant = useRef(null);
  const editTenant = useRef(null);
  const deleteTenant = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: SystemTenantResponse) => {
      if (checked) {
        await enableSystemTenant(data.id);
      } else {
        await disableSystemTenant(data.id);
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
    return (status && !hasOperatePermission('system:tenant:list:enable')) || (!status && !hasOperatePermission('system:tenant:list:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("page.tenant.title.name"), flex: 1, minWidth: 100 },
      {
        field: 'package_name',
        headerName: t("page.tenant.title.package"),
        flex: 1,
        minWidth: 120,
        renderCell: (params: GridRenderCellParams) => (
          <>
            <CustomizedTag label={params.row.package_name} />
          </>
        )
      },
      { field: 'contact_name', headerName: t("page.tenant.title.contact.name"), flex: 1, minWidth: 120 },
      { field: 'contact_mobile', headerName: t("page.tenant.title.contact.mobile"), flex: 1, minWidth: 150 },
      { field: 'website', headerName: t("page.tenant.title.website"), flex: 1, minWidth: 180 },
      { field: 'expire_time', headerName: t("page.tenant.title.expire.time"), flex: 1, minWidth: 180 },
      { field: 'account_count', headerName: t("page.tenant.title.account.count"), flex: 1, minWidth: 100 },
      {
        field: 'status',
        sortable: false,
        headerName: t("page.tenant.title.status"),
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
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            {hasOperatePermission('system:tenant:list:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('page.tenant.operate.edit')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('system:tenant:list:delete') && <Button
              sx={{ mt: 1, color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('page.tenant.operate.delete')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </Box>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async (condition: SystemTenantQueryCondition) => {
    const result = await pageSystemTenant(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addTenant.current as any).show();
  }

  const handleClickOpenEdit = (tenant: SystemTenantResponse) => {
    (editTenant.current as any).show(tenant);
  };

  const handleClickOpenDelete = (tenant: SystemTenantResponse) => {
    (deleteTenant.current as any).show(tenant);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as SystemTenantQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as SystemTenantQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('system:tenant:list:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <TenantAdd ref={addTenant} onSubmit={refreshData} />
      <TenantEdit ref={editTenant} onSubmit={refreshData} />
      <TenantDelete ref={deleteTenant} onSubmit={refreshData} />
    </Box>
  );
}