import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import ViewIcon from '@/assets/image/svg/view.svg';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { pageErpInventoryTransfer, ErpInventoryTransferQueryCondition, ErpInventoryTransferResponse } from '@/api';
import ErpInventoryTransferAdd from './Add';
import ErpInventoryTransferEdit from './Edit';
import ErpInventoryTransferDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import ErpInventoryTransferInfo from './Info';
import CustomizedCopyableText from '@/components/CustomizedCopyableText';

export default function ErpInventoryTransfer() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpInventoryTransferQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpInventoryTransferResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const viewErpInventoryTransfer = useRef(null);
  const addErpInventoryTransfer = useRef(null);
  const editErpInventoryTransfer = useRef(null);
  const deleteErpInventoryTransfer = useRef(null);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'order_number', 
        headerName: t("page.erp.inventory.transfer.title.order.number"), 
        flex: 1, 
        minWidth: 100, 
        renderCell: (params: GridRenderCellParams) => (
          <CustomizedCopyableText
            text={params.row.order_number}
          />
        )
      },
      { field: 'transfer_date', headerName: t("page.erp.inventory.transfer.title.transfer.date"), flex: 1, minWidth: 100 },
      { field: 'remarks', headerName: t("page.erp.inventory.transfer.title.remarks"), flex: 1, minWidth: 100 },
      { field: 'create_time', headerName: t("global.title.create.time"), flex: 1, minWidth: 180 },
      {
        field: 'actions',
        sortable: false,
        resizable: false,
        headerName: t("global.operate.actions"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <CustomizedAutoMore>
            {hasOperatePermission('erp:inventory:transfer:get') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.view') + t('global.page.erp.inventory.transfer')}
              startIcon={<ViewIcon />}
              onClick={() => handleClickOpenView(params.row)}
            />}
            {hasOperatePermission('erp:inventory:transfer:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.erp.inventory.transfer')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('erp:inventory:transfer:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.erp.inventory.transfer')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t]
  );

  const queryRecords = async (condition: ErpInventoryTransferQueryCondition) => {
    const result = await pageErpInventoryTransfer(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addErpInventoryTransfer.current as any).show();
  }

  const handleClickOpenView = (erpInventoryTransfer: ErpInventoryTransferResponse) => {
    (viewErpInventoryTransfer.current as any).show(erpInventoryTransfer);
  };

  const handleClickOpenEdit = (erpInventoryTransfer: ErpInventoryTransferResponse) => {
    (editErpInventoryTransfer.current as any).show(erpInventoryTransfer);
  };

  const handleClickOpenDelete = (erpInventoryTransfer: ErpInventoryTransferResponse) => {
    (deleteErpInventoryTransfer.current as any).show(erpInventoryTransfer);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpInventoryTransferQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpInventoryTransferQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('erp:inventory:transfer:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <ErpInventoryTransferInfo ref={viewErpInventoryTransfer} />
      <ErpInventoryTransferAdd ref={addErpInventoryTransfer} onSubmit={refreshData} />
      <ErpInventoryTransferEdit ref={editErpInventoryTransfer} onSubmit={refreshData} />
      <ErpInventoryTransferDelete ref={deleteErpInventoryTransfer} onSubmit={refreshData} />
    </Box>
  );
}