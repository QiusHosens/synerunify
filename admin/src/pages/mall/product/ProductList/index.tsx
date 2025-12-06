import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import ViewIcon from '@/assets/image/svg/view.svg';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import ArrowDownDoubleIcon from '@/assets/image/svg/arrow_down_double.svg';
import ArrowTopDoubleIcon from '@/assets/image/svg/arrow_top_double.svg';
import { disableMallProductSpu, enableMallProductSpu, pageMallProductSpu, MallProductSpuQueryCondition, MallProductSpuResponse } from '@/api';
import MallProductSpuAdd from './Add';
import MallProductSpuEdit from './Edit';
import MallProductSpuDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import MallProductSpuInfo from './Info';
import MallProductSpuPublish from './Publish';
import MallProductSpuUnpublish from './Unpublish';

export default function MallProductSpu() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<MallProductSpuQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<MallProductSpuResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const viewMallProductSpu = useRef(null);
  const addMallProductSpu = useRef(null);
  const editMallProductSpu = useRef(null);
  const deleteMallProductSpu = useRef(null);
  const publishMallProductSpu = useRef(null);
  const unpublishMallProductSpu = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: MallProductSpuResponse) => {
      if (checked) {
        await enableMallProductSpu(data.id);
      } else {
        await disableMallProductSpu(data.id);
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
    return (status && !hasOperatePermission('mall:product:list:enable')) || (!status && !hasOperatePermission('mall:product:list:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("page.mall.product.title.name"), flex: 1, minWidth: 100 },
      { field: 'price', headerName: t("page.mall.product.title.price"), flex: 1, minWidth: 100 },
      { field: 'sales_count', headerName: t("page.mall.product.title.sales.count"), flex: 1, minWidth: 100 },
      { field: 'stock', headerName: t("page.mall.product.title.stock"), flex: 1, minWidth: 100 },
      { field: 'browse_count', headerName: t("page.mall.product.title.browse.count"), flex: 1, minWidth: 100 },
      { field: 'sort', headerName: t("page.mall.product.title.sort"), flex: 1, minWidth: 100 },
      {
        field: 'status',
        sortable: false,
        headerName: t("global.title.status"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            <Switch name="status" checked={!params.row.status} disabled={statusDisabled(params.row.status)} onChange={(event, checked) => handleStatusChange(event, checked, params.row)} />
          </Box>
        ),
      },
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
            {hasOperatePermission('mall:product:list:get') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.view') + t('global.page.mall.product')}
              startIcon={<ViewIcon />}
              onClick={() => handleClickOpenView(params.row)}
            />}
            {hasOperatePermission('mall:product:list:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.mall.product')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('mall:product:list:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.mall.product')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
            {hasOperatePermission('mall:product:list:publish') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.publish') + t('global.page.mall.product')}
              startIcon={<ArrowTopDoubleIcon />}
              onClick={() => handleClickOpenPublish(params.row)}
            />}
            {hasOperatePermission('mall:product:list:unpublish') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.unpublish') + t('global.page.mall.product')}
              startIcon={<ArrowDownDoubleIcon />}
              onClick={() => handleClickOpenUnpublish(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t, statusDisabled, handleStatusChange, hasOperatePermission]
  );

  const queryRecords = async (condition: MallProductSpuQueryCondition) => {
    const result = await pageMallProductSpu(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addMallProductSpu.current as any).show();
  }

  const handleClickOpenView = (mallProductSpu: MallProductSpuResponse) => {
    (viewMallProductSpu.current as any).show(mallProductSpu);
  };

  const handleClickOpenEdit = (mallProductSpu: MallProductSpuResponse) => {
    (editMallProductSpu.current as any).show(mallProductSpu);
  };

  const handleClickOpenDelete = (mallProductSpu: MallProductSpuResponse) => {
    (deleteMallProductSpu.current as any).show(mallProductSpu);
  };

  const handleClickOpenPublish = (mallProductSpu: MallProductSpuResponse) => {
    (publishMallProductSpu.current as any).show(mallProductSpu);
  };

  const handleClickOpenUnpublish = (mallProductSpu: MallProductSpuResponse) => {
    (unpublishMallProductSpu.current as any).show(mallProductSpu);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as MallProductSpuQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as MallProductSpuQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('mall:product:list:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <MallProductSpuInfo ref={viewMallProductSpu} />
      <MallProductSpuAdd ref={addMallProductSpu} onSubmit={refreshData} />
      <MallProductSpuEdit ref={editMallProductSpu} onSubmit={refreshData} />
      <MallProductSpuDelete ref={deleteMallProductSpu} onSubmit={refreshData} />
      <MallProductSpuPublish ref={publishMallProductSpu} onSubmit={refreshData} />
      <MallProductSpuUnpublish ref={unpublishMallProductSpu} onSubmit={refreshData} />
    </Box>
  );
}