import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { pageMallStoreNotice, MallStoreNoticeQueryCondition, MallStoreNoticeResponse } from '@/api';
import MallStoreNoticeAdd from './Add';
import MallStoreNoticeEdit from './Edit';
import MallStoreNoticeDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';

export default function MallStoreNotice() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<MallStoreNoticeQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<MallStoreNoticeResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addMallStoreNotice = useRef(null);
  const editMallStoreNotice = useRef(null);
  const deleteMallStoreNotice = useRef(null);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'store_id', headerName: t("page.mall.store.notice.title.store"), flex: 1, minWidth: 100 },
      { field: 'title', headerName: t("page.mall.store.notice.title.title"), flex: 1, minWidth: 100 },
      { field: 'content', headerName: t("page.mall.store.notice.title.content"), flex: 1, minWidth: 100 },
      { field: 'top', headerName: t("page.mall.store.notice.title.top"), flex: 1, minWidth: 100 },

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
            {hasOperatePermission('mall:store:notice:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.mall.store.notice')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('mall:store:notice:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.mall.store.notice')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t]
  );

  const queryRecords = async (condition: MallStoreNoticeQueryCondition) => {
    const result = await pageMallStoreNotice(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addMallStoreNotice.current as any).show();
  }

  const handleClickOpenEdit = (mallStoreNotice: MallStoreNoticeResponse) => {
    (editMallStoreNotice.current as any).show(mallStoreNotice);
  };

  const handleClickOpenDelete = (mallStoreNotice: MallStoreNoticeResponse) => {
    (deleteMallStoreNotice.current as any).show(mallStoreNotice);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as MallStoreNoticeQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as MallStoreNoticeQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('mall:store:notice:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <MallStoreNoticeAdd ref={addMallStoreNotice} onSubmit={refreshData} />
      <MallStoreNoticeEdit ref={editMallStoreNotice} onSubmit={refreshData} />
      <MallStoreNoticeDelete ref={deleteMallStoreNotice} onSubmit={refreshData} />
    </Box>
  );
}