import { Box, Button, styled, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableMallTradeDeliveryPickUpStore, enableMallTradeDeliveryPickUpStore, pageMallTradeDeliveryPickUpStore, MallTradeDeliveryPickUpStoreQueryCondition, MallTradeDeliveryPickUpStoreResponse } from '@/api';
import MallTradeDeliveryPickUpStoreAdd from './Add';
import MallTradeDeliveryPickUpStoreEdit from './Edit';
import MallTradeDeliveryPickUpStoreDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import { downloadSystemFile } from '@/api/system_file';

export default function MallTradeDeliveryPickUpStore() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<MallTradeDeliveryPickUpStoreQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<MallTradeDeliveryPickUpStoreResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addMallTradeDeliveryPickUpStore = useRef(null);
  const editMallTradeDeliveryPickUpStore = useRef(null);
  const deleteMallTradeDeliveryPickUpStore = useRef(null);

  const PreviewImage = styled('img')({
    height: '60%',
    objectFit: 'contain',
    top: 0,
    left: 0,
  });

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: MallTradeDeliveryPickUpStoreResponse) => {
      if (checked) {
        await enableMallTradeDeliveryPickUpStore(data.id);
      } else {
        await disableMallTradeDeliveryPickUpStore(data.id);
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
    return (status && !hasOperatePermission('mall:trade:delivery:store:store:enable')) || (!status && !hasOperatePermission('mall:trade:delivery:store:store:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("page.mall.trade.delivery.store.title.name"), flex: 1, minWidth: 100 },
      {
        field: 'file_id',
        headerName: t("page.mall.trade.delivery.store.title.file"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            <PreviewImage src={params.row.previewUrl} />
          </Box>
        ),
      },
      { field: 'phone', headerName: t("page.mall.trade.delivery.store.title.phone"), flex: 1, minWidth: 100 },
      { field: 'detail_address', headerName: t("page.mall.trade.delivery.store.title.detail.address"), flex: 1, minWidth: 100 },
      { field: 'opening_time', headerName: t("page.mall.trade.delivery.store.title.opening.time"), flex: 1, minWidth: 100 },
      { field: 'closing_time', headerName: t("page.mall.trade.delivery.store.title.closing.time"), flex: 1, minWidth: 100 },
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
            {hasOperatePermission('mall:trade:delivery:store:store:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.mall.trade.delivery.store')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('mall:trade:delivery:store:store:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.mall.trade.delivery.store')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async (condition: MallTradeDeliveryPickUpStoreQueryCondition) => {
    const result = await pageMallTradeDeliveryPickUpStore(condition);
    setRecords(result.list);
    setTotal(result.total);

    loadImages(result.list);
  };

  const loadImages = (list: Array<MallTradeDeliveryPickUpStoreResponse>) => {
    for (let index = 0, len = list.length; index < len; index++) {
      const brand = list[index];
      // 设置图片
      downloadSystemFile(brand.file_id, (progress) => { }).then(file => {
        setRecords(prev =>
          prev.map(item => item.id === brand.id ? { ...item, previewUrl: window.URL.createObjectURL(file) } : item)
        )
      })
    }
  }

  const handleClickOpenAdd = () => {
    (addMallTradeDeliveryPickUpStore.current as any).show();
  }

  const handleClickOpenEdit = (mallTradeDeliveryPickUpStore: MallTradeDeliveryPickUpStoreResponse) => {
    (editMallTradeDeliveryPickUpStore.current as any).show(mallTradeDeliveryPickUpStore);
  };

  const handleClickOpenDelete = (mallTradeDeliveryPickUpStore: MallTradeDeliveryPickUpStoreResponse) => {
    (deleteMallTradeDeliveryPickUpStore.current as any).show(mallTradeDeliveryPickUpStore);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as MallTradeDeliveryPickUpStoreQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as MallTradeDeliveryPickUpStoreQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('mall:trade:delivery:store:store:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <MallTradeDeliveryPickUpStoreAdd ref={addMallTradeDeliveryPickUpStore} onSubmit={refreshData} />
      <MallTradeDeliveryPickUpStoreEdit ref={editMallTradeDeliveryPickUpStore} onSubmit={refreshData} />
      <MallTradeDeliveryPickUpStoreDelete ref={deleteMallTradeDeliveryPickUpStore} onSubmit={refreshData} />
    </Box>
  );
}