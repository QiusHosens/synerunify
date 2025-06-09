import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableErpProduct, enableErpProduct, pageErpProduct, ErpProductQueryCondition, ErpProductResponse } from '@/api';
import ErpProductAdd from './Add';
import ErpProductEdit from './Edit';
import ErpProductDelete from './Delete';
import { useHomeStore } from '@/store';

export default function ErpProduct() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<ErpProductQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<ErpProductResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addErpProduct = useRef(null);
  const editErpProduct = useRef(null);
  const deleteErpProduct = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: ErpProductResponse) => {
      if (checked) {
        await enableErpProduct(data.id);
      } else {
        await disableErpProduct(data.id);
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
    return (status && !hasOperatePermission('system:post:enable')) || (!status && !hasOperatePermission('system:post:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'product_code', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'name', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'category_id', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'unit_id', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'status', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'barcode', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'specification', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'shelf_life_days', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'weight', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'purchase_price', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'sale_price', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'min_price', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'stock_quantity', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'min_stock', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'remarks', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'department_code', headerName: t("page."), flex: 1, minWidth: 100 },
      { field: 'department_id', headerName: t("page."), flex: 1, minWidth: 100 },
      
      {
        field: 'status',
        sortable: false,
        headerName: t("page.post.title.status"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={ { height: '100%', display: 'flex', gap: 1, alignItems: 'center' } }>
            <Switch name="status" checked={!params.row.status} disabled={statusDisabled(params.row.status)} onChange={(event, checked) => handleStatusChange(event, checked, params.row)} />
          </Box>
        ),
      },
      { field: 'create_time', headerName: t("page.post.title.create.time"), flex: 1, minWidth: 180 },
      {
        field: 'actions',
        sortable: false,
        resizable: false,
        headerName: t("global.operate.actions"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={ { height: '100%', display: 'flex', gap: 1, alignItems: 'center' } }>
            {hasOperatePermission('system:post:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('page.post.operate.edit')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('system:post:delete') && <Button
              sx={ {color: 'error.main'} }
              size="small"
              variant='customOperate'
              title={t('page.post.operate.delete')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </Box>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async (condition: ErpProductQueryCondition) => {
    const result = await pageErpProduct(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addErpProduct.current as any).show();
  }

  const handleClickOpenEdit = (erpProduct: ErpProductResponse) => {
    (editErpProduct.current as any).show(erpProduct);
  };

  const handleClickOpenDelete = (erpProduct: ErpProductResponse) => {
    (deleteErpProduct.current as any).show(erpProduct);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as ErpProductQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as ErpProductQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={ {height: '100%', display: 'flex', flexDirection: 'column'} }>
      <Box sx={ {mb: 2, display: 'flex', justifyContent: 'space-between'} }>
        <Box></Box>
        {hasOperatePermission('system:post:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
        paginationModel={ {page: condition.page - 1, pageSize: condition.size} }
        onPaginationModelChange={(model) => {
          setCondition((prev) => ({
            ...prev,
            page: model.page + 1,
            size: model.pageSize,
          }));
        }}
      />
      <ErpProductAdd ref={addErpProduct} onSubmit={refreshData} />
      <ErpProductEdit ref={editErpProduct} onSubmit={refreshData} />
      <ErpProductDelete ref={deleteErpProduct} onSubmit={refreshData} />
    </Box>
  );
}