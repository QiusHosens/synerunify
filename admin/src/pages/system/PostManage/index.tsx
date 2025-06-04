import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableSystemPost, enableSystemPost, pageSystemPost, SystemPostQueryCondition, SystemPostResponse } from '@/api';
import PostAdd from './Add';
import PostEdit from './Edit';
import PostDelete from './Delete';
import { useHomeStore } from '@/store';

export default function PostManage() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<SystemPostQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<SystemPostResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const addPost = useRef(null);
  const editPost = useRef(null);
  const deletePost = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: SystemPostResponse) => {
      if (checked) {
        await enableSystemPost(data.id);
      } else {
        await disableSystemPost(data.id);
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
      { field: 'name', headerName: t("page.post.title.name"), flex: 1, minWidth: 100 },
      { field: 'code', headerName: t("page.post.title.code"), flex: 1, minWidth: 100 },
      { field: 'sort', headerName: t("page.post.title.sort"), flex: 1, minWidth: 60 },
      { field: 'remark', headerName: t("page.post.title.remark"), flex: 1, minWidth: 100 },
      {
        field: 'status',
        sortable: false,
        headerName: t("page.post.title.status"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
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
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            {hasOperatePermission('system:post:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('page.post.operate.edit')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('system:post:delete') && <Button
              sx={{ color: 'error.main' }}
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

  const queryRecords = async (condition: SystemPostQueryCondition) => {
    const result = await pageSystemPost(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addPost.current as any).show();
  }

  const handleClickOpenEdit = (post: SystemPostResponse) => {
    (editPost.current as any).show(post);
  };

  const handleClickOpenDelete = (post: SystemPostResponse) => {
    (deletePost.current as any).show(post);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as SystemPostQueryCondition));
    }
  };

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
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
      <PostAdd ref={addPost} onSubmit={refreshData} />
      <PostEdit ref={editPost} onSubmit={refreshData} />
      <PostDelete ref={deletePost} onSubmit={refreshData} />
    </Box>
  );
}