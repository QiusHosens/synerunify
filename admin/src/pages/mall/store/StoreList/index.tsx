import { Box, Button, styled, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { pageMallStore, MallStoreQueryCondition, MallStoreResponse, openMallStore, pauseMallStore } from '@/api';
import MallStoreAdd from './Add';
import MallStoreEdit from './Edit';
import MallStoreDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';
import { downloadSystemFile } from '@/api/system_file';
import CustomizedDictTag from '@/components/CustomizedDictTag';
import MallStoreAccept from './Accept';
import MallStoreReject from './Reject';
import MallStoreClose from './Close';

export default function MallStore() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<MallStoreQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<MallStoreResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addMallStore = useRef(null);
  const editMallStore = useRef(null);
  const deleteMallStore = useRef(null);
  const acceptMallStore = useRef(null);
  const rejectMallStore = useRef(null);
  const closeMallStore = useRef(null);

  const PreviewImage = styled('img')({
    height: '60%',
    objectFit: 'contain',
    top: 0,
    left: 0,
  });

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: MallStoreResponse) => {
      if (checked) {
        await openMallStore(data.id);
      } else {
        await pauseMallStore(data.id);
      }

      // 更新表格
      setRecords((prev) =>
        prev.map((r) =>
          r.id === data.id ? { ...r, status: checked ? 2 : 3 } : r
        )
      );
    },
    []
  );

  const statusDisabled = (status: number): boolean => {
    return (status && !hasOperatePermission('mall:store:list:open')) || (!status && !hasOperatePermission('mall:store:list:pause'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'number', headerName: t("page.mall.store.title.number"), flex: 1.5, minWidth: 150 },
      { field: 'name', headerName: t("page.mall.store.title.name"), flex: 1, minWidth: 100 },
      { field: 'short_name', headerName: t("page.mall.store.title.short.name"), flex: 1, minWidth: 100 },
      {
        field: 'file_id',
        headerName: t("page.mall.store.title.file"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            <PreviewImage src={params.row.previewUrl} />
          </Box>
        ),
      },
      { field: 'slogan', headerName: t("page.mall.store.title.slogan"), flex: 1, minWidth: 100 },
      { field: 'sort', headerName: t("page.mall.store.title.sort"), flex: 1, minWidth: 100 },
      {
        field: 'status',
        sortable: false,
        headerName: t("global.title.status"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            {params.row.status != 1 && params.row.status != 2 && params.row.status != 3 && <CustomizedDictTag type='store_status' value={params.row.status} />}
            {(params.row.status == 1 || params.row.status == 2 || params.row.status == 3) && <Switch name="status" checked={params.row.status == 2} disabled={statusDisabled(params.row.status)} onChange={(event, checked) => handleStatusChange(event, checked, params.row)} />}
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
            {hasOperatePermission('mall:store:list:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.mall.store')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('mall:store:list:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.mall.store')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
            {hasOperatePermission('mall:store:list:accept') && params.row.status == 0 && <Button
              size="small"
              variant='customOperate'
              title={t('page.mall.store.operate.accept')}
              startIcon={<CheckCircleIcon />}
              onClick={() => handleClickReviewAccept(params.row)}
            />}
            {hasOperatePermission('mall:store:list:reject') && params.row.status == 0 && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('page.mall.store.operate.reject')}
              startIcon={<RemoveCircleIcon />}
              onClick={() => handleClickReviewReject(params.row)}
            />}
            {hasOperatePermission('mall:store:list:close') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('page.mall.store.operate.close')}
              startIcon={<CancelIcon />}
              onClick={() => handleClickClose(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async (condition: MallStoreQueryCondition) => {
    const result = await pageMallStore(condition);
    const list = result.list;
    setRecords(list);
    setTotal(result.total);

    loadImages(list);
  };

  const loadImages = (list: Array<MallStoreResponse>) => {
    for (let index = 0, len = list.length; index < len; index++) {
      const brand = list[index];
      if (brand.file_id) {
        // 设置图片
        downloadSystemFile(brand.file_id, () => { }).then(file => {
          setRecords(prev =>
            prev.map(item => item.id === brand.id ? { ...item, previewUrl: window.URL.createObjectURL(file) } : item)
          )
        })
      }
    }
  }

  const handleClickOpenAdd = () => {
    (addMallStore.current as any).show();
  }

  const handleClickOpenEdit = (mallStore: MallStoreResponse) => {
    (editMallStore.current as any).show(mallStore);
  };

  const handleClickOpenDelete = (mallStore: MallStoreResponse) => {
    (deleteMallStore.current as any).show(mallStore);
  };

  const handleClickReviewAccept = (mallStore: MallStoreResponse) => {
    (acceptMallStore.current as any).show(mallStore);
  };

  const handleClickReviewReject = (mallStore: MallStoreResponse) => {
    (rejectMallStore.current as any).show(mallStore);
  };

  const handleClickClose = (mallStore: MallStoreResponse) => {
    (closeMallStore.current as any).show(mallStore);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as MallStoreQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as MallStoreQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('mall:store:list:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <MallStoreAdd ref={addMallStore} onSubmit={refreshData} />
      <MallStoreEdit ref={editMallStore} onSubmit={refreshData} />
      <MallStoreDelete ref={deleteMallStore} onSubmit={refreshData} />
      <MallStoreAccept ref={acceptMallStore} onSubmit={refreshData} />
      <MallStoreReject ref={rejectMallStore} onSubmit={refreshData} />
      <MallStoreClose ref={closeMallStore} onSubmit={refreshData} />
    </Box>
  );
}