import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import ViewIcon from '@/assets/image/svg/view.svg';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { pageErpInventoryCheck, ErpInventoryCheckQueryCondition, ErpInventoryCheckResponse } from '@/api';
import ErpInventoryCheckAdd from './Add';
import ErpInventoryCheckEdit from './Edit';
import ErpInventoryCheckDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import ErpInventoryCheckInfo from './Info';
import CustomizedCopyableText from '@/components/CustomizedCopyableText';

export default function ErpInventoryCheck() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpInventoryCheckQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpInventoryCheckResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const viewErpInventoryCheck = useRef(null);
  const addErpInventoryCheck = useRef(null);
  const editErpInventoryCheck = useRef(null);
  const deleteErpInventoryCheck = useRef(null);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'order_number',
        headerName: t("erp.common.title.order.number"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <CustomizedCopyableText
            text={params.row.order_number}
          />
        )
      },
      { field: 'check_date', headerName: t("page.erp.inventory.check.title.check.date"), flex: 1, minWidth: 100 },
      { field: 'remarks', headerName: t("common.title.remark"), flex: 1, minWidth: 100 },
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
            {hasOperatePermission('erp:inventory:check:get') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.view') + t('global.page.erp.inventory.check')}
              startIcon={<ViewIcon />}
              onClick={() => handleClickOpenView(params.row)}
            />}
            {hasOperatePermission('erp:inventory:check:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.erp.inventory.check')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('erp:inventory:check:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.erp.inventory.check')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t]
  );

  const queryRecords = async (condition: ErpInventoryCheckQueryCondition) => {
    const result = await pageErpInventoryCheck(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addErpInventoryCheck.current as any).show();
  }

  const handleClickOpenView = (erpInventoryCheck: ErpInventoryCheckResponse) => {
    (viewErpInventoryCheck.current as any).show(erpInventoryCheck);
  };

  const handleClickOpenEdit = (erpInventoryCheck: ErpInventoryCheckResponse) => {
    (editErpInventoryCheck.current as any).show(erpInventoryCheck);
  };

  const handleClickOpenDelete = (erpInventoryCheck: ErpInventoryCheckResponse) => {
    (deleteErpInventoryCheck.current as any).show(erpInventoryCheck);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpInventoryCheckQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpInventoryCheckQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('erp:inventory:check:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <ErpInventoryCheckInfo ref={viewErpInventoryCheck} />
      <ErpInventoryCheckAdd ref={addErpInventoryCheck} onSubmit={refreshData} />
      <ErpInventoryCheckEdit ref={editErpInventoryCheck} onSubmit={refreshData} />
      <ErpInventoryCheckDelete ref={deleteErpInventoryCheck} onSubmit={refreshData} />
    </Box>
  );
}