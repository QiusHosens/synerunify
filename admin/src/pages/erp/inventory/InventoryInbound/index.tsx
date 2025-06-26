import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import ViewIcon from '@/assets/image/svg/view.svg';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { ErpInboundOrderQueryCondition, ErpInboundOrderResponse, pageOtherErpInboundOrder } from '@/api';
import ErpInboundOrderAdd from './Add';
import ErpInboundOrderEdit from './Edit';
import ErpInboundOrderDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import CustomizedCopyableText from '@/components/CustomizedCopyableText';
import ErpInboundOrderInfo from './Info';

export default function ErpInboundOrder() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpInboundOrderQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpInboundOrderResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const viewErpInboundOrder = useRef(null);
  const addErpInboundOrder = useRef(null);
  const editErpInboundOrder = useRef(null);
  const deleteErpInboundOrder = useRef(null);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'order_number',
        headerName: t("page.erp.purchase.inbound.title.order.number"),
        flex: 1.4,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <CustomizedCopyableText
            text={params.row.order_number}
          />
        )
      },
      { field: 'inbound_date', headerName: t("page.erp.purchase.inbound.title.inbound.date"), flex: 1, minWidth: 100 },
      { field: 'settlement_account_name', headerName: t("page.erp.purchase.inbound.title.settlement.account"), flex: 1, minWidth: 100 },
      { field: 'discount_rate', headerName: t("page.erp.purchase.inbound.title.discount.rate"), flex: 1, minWidth: 100 },
      { field: 'other_cost', headerName: t("page.erp.purchase.inbound.title.other.cost"), flex: 1, minWidth: 100 },
      { field: 'remarks', headerName: t("page.erp.purchase.inbound.title.remarks"), flex: 1, minWidth: 100 },
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
            {hasOperatePermission('erp:inventory:inbound:get') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.view') + t('global.page.erp.purchase.order')}
              startIcon={<ViewIcon />}
              onClick={() => handleClickOpenView(params.row)}
            />}
            {hasOperatePermission('erp:inventory:inbound:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.erp.purchase.inbound')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('erp:inventory:inbound:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.erp.purchase.inbound')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t]
  );

  const queryRecords = async (condition: ErpInboundOrderQueryCondition) => {
    const result = await pageOtherErpInboundOrder(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenView = (erpInboundOrder: ErpInboundOrderResponse) => {
    (viewErpInboundOrder.current as any).show(erpInboundOrder);
  }

  const handleClickOpenAdd = () => {
    (addErpInboundOrder.current as any).show();
  }

  const handleClickOpenEdit = (erpInboundOrder: ErpInboundOrderResponse) => {
    (editErpInboundOrder.current as any).show(erpInboundOrder);
  };

  const handleClickOpenDelete = (erpInboundOrder: ErpInboundOrderResponse) => {
    (deleteErpInboundOrder.current as any).show(erpInboundOrder);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpInboundOrderQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpInboundOrderQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('erp:inventory:inbound:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <ErpInboundOrderInfo ref={viewErpInboundOrder} />
      <ErpInboundOrderAdd ref={addErpInboundOrder} onSubmit={refreshData} />
      <ErpInboundOrderEdit ref={editErpInboundOrder} onSubmit={refreshData} />
      <ErpInboundOrderDelete ref={deleteErpInboundOrder} onSubmit={refreshData} />
    </Box>
  );
}