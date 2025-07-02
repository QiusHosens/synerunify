import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { pageErpProductInventory, ErpProductInventoryQueryCondition, ErpProductInventoryResponse } from '@/api';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';

export default function ErpProductInventory() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpProductInventoryQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpProductInventoryResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const editErpProductInventory = useRef(null);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'product_name', headerName: t("erp.common.title.product.name"), flex: 1, minWidth: 100 },
      { field: 'warehouse_name', headerName: t("erp.common.title.warehouse.name"), flex: 1, minWidth: 100 },
      { field: 'stock_quantity', headerName: t("erp.common.title.stock.quantity"), flex: 1, minWidth: 100 },
      { field: 'unit_name', headerName: t("page.erp.product.unit.title.name"), flex: 1, minWidth: 100 },
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
            {hasOperatePermission('mark_permission:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.mark_translation')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t]
  );

  const queryRecords = async (condition: ErpProductInventoryQueryCondition) => {
    const result = await pageErpProductInventory(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenEdit = (erpProductInventory: ErpProductInventoryResponse) => {
    (editErpProductInventory.current as any).show(erpProductInventory);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpProductInventoryQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpProductInventoryQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={ {height: '100%', display: 'flex', flexDirection: 'column'} }>
      <Box sx={ {mb: 2, display: 'flex', justifyContent: 'space-between'} }>
        <Box></Box>
        <Box></Box>
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
        paginationModel={ {page: condition.page - 1, pageSize: condition.size} }
        onPaginationModelChange={(model) => {
          setCondition((prev) => ({
            ...prev,
            page: model.page + 1,
            size: model.pageSize,
          }));
        }}
      />
    </Box>
  );
}