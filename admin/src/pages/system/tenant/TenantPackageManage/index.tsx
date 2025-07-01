import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableSystemTenantPackage, enableSystemTenantPackage, pageSystemTenantPackage, SystemTenantPackageQueryCondition, SystemTenantPackageResponse } from '@/api';
import TenantPackageAdd from './Add';
import TenantPackageEdit from './Edit';
import TenantPackageDelete from './Delete';
import TenantPackageMenuSetting from './MenuSetting';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';

export default function TenantPackageManage() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<SystemTenantPackageQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<SystemTenantPackageResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addTenantPackage = useRef(null);
  const editTenantPackage = useRef(null);
  const deleteTenantPackage = useRef(null);
  const tenantPackageMenuSetting = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: SystemTenantPackageResponse) => {
      if (checked) {
        await enableSystemTenantPackage(data.id);
      } else {
        await disableSystemTenantPackage(data.id);
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
    return (status && !hasOperatePermission('system:tenant:package:enable')) || (!status && !hasOperatePermission('system:tenant:package:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("common.title.name"), flex: 1, minWidth: 100 },
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
      { field: 'create_time', headerName: t("common.title.create.time"), flex: 1, minWidth: 180 },
      {
        field: 'actions',
        sortable: false,
        resizable: false,
        headerName: t("global.operate.actions"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <CustomizedAutoMore>
            {hasOperatePermission('system:tenant:package:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('page.tenant.package.operate.edit')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('system:tenant:package:menu') && <Button
              size="small"
              variant='customOperate'
              title={t('page.tenant.package.operate.menu')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenData(params.row)}
            />}
            {hasOperatePermission('system:tenant:package:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('page.tenant.package.operate.delete')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async (condition: SystemTenantPackageQueryCondition) => {
    const result = await pageSystemTenantPackage(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addTenantPackage.current as any).show();
  }

  const handleClickOpenEdit = (tenantPackage: SystemTenantPackageResponse) => {
    (editTenantPackage.current as any).show(tenantPackage);
  };

  const handleClickOpenDelete = (tenantPackage: SystemTenantPackageResponse) => {
    (deleteTenantPackage.current as any).show(tenantPackage);
  };

  const handleClickOpenData = (tenantPackage: SystemTenantPackageResponse) => {
    (tenantPackageMenuSetting.current as any).show(tenantPackage);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as SystemTenantPackageQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as SystemTenantPackageQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('system:tenant:package:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <TenantPackageAdd ref={addTenantPackage} onSubmit={refreshData} />
      <TenantPackageEdit ref={editTenantPackage} onSubmit={refreshData} />
      <TenantPackageDelete ref={deleteTenantPackage} onSubmit={refreshData} />
      <TenantPackageMenuSetting ref={tenantPackageMenuSetting} onSubmit={refreshData} />
    </Box>
  );
}