import { Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { pageMallProductComment, MallProductCommentQueryCondition, MallProductCommentResponse } from '@/api';
import MallProductCommentAdd from './Add';
import MallProductCommentEdit from './Edit';
import MallProductCommentDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedAutoMore from '@/components/CustomizedAutoMore';

export default function MallProductComment() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [total, setTotal] = useState<number>(0);
  const [condition, setCondition] = useState<MallProductCommentQueryCondition>({
    page: 1,
    size: 20,
  });

  const [records, setRecords] = useState<Array<MallProductCommentResponse>>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();

  const addMallProductComment = useRef(null);
  const editMallProductComment = useRef(null);
  const deleteMallProductComment = useRef(null);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'user_nickname', headerName: t("page.mall.product.comment.title.user.nickname"), flex: 1, minWidth: 100 },
      { field: 'user_avatar', headerName: t("page.mall.product.comment.title.user.avatar"), flex: 1, minWidth: 100 },
      { field: 'anonymous', headerName: t("page.mall.product.comment.title.anonymous"), flex: 1, minWidth: 100 },
      { field: 'order_id', headerName: t("page.mall.product.comment.title.order"), flex: 1, minWidth: 100 },
      { field: 'order_item_id', headerName: t("page.mall.product.comment.title.order.item"), flex: 1, minWidth: 100 },
      { field: 'spu_name', headerName: t("page.mall.product.comment.title.spu.name"), flex: 1, minWidth: 100 },
      { field: 'visible', headerName: t("page.mall.product.comment.title.visible"), flex: 1, minWidth: 100 },
      { field: 'scores', headerName: t("page.mall.product.comment.title.scores"), flex: 1, minWidth: 100 },
      { field: 'description_scores', headerName: t("page.mall.product.comment.title.description.scores"), flex: 1, minWidth: 100 },
      { field: 'benefit_scores', headerName: t("page.mall.product.comment.title.benefit.scores"), flex: 1, minWidth: 100 },
      { field: 'content', headerName: t("page.mall.product.comment.title.content"), flex: 1, minWidth: 100 },
      { field: 'reply_status', headerName: t("page.mall.product.comment.title.reply.status"), flex: 1, minWidth: 100 },
      { field: 'reply_content', headerName: t("page.mall.product.comment.title.reply.content"), flex: 1, minWidth: 100 },
      { field: 'reply_time', headerName: t("page.mall.product.comment.title.reply.time"), flex: 1, minWidth: 100 },
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
            {hasOperatePermission('mall:product:comment:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.mall.product.comment')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('mall:product:comment:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.mall.product.comment')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </CustomizedAutoMore>
        ),
      },
    ],
    [t]
  );

  const queryRecords = async (condition: MallProductCommentQueryCondition) => {
    const result = await pageMallProductComment(condition);
    setRecords(result.list);
    setTotal(result.total);
  };

  const handleClickOpenAdd = () => {
    (addMallProductComment.current as any).show();
  }

  const handleClickOpenEdit = (mallProductComment: MallProductCommentResponse) => {
    (editMallProductComment.current as any).show(mallProductComment);
  };

  const handleClickOpenDelete = (mallProductComment: MallProductCommentResponse) => {
    (deleteMallProductComment.current as any).show(mallProductComment);
  };

  useEffect(() => {
    refreshData();
  }, [condition]);

  const handleSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
    setSortModel(model);
    if (model.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ sort_field: model[0].field, sort: model[0].sort } } as MallProductCommentQueryCondition));
    }
  };

  const handleFilterModelChange = (model: GridFilterModel, _details: GridCallbackDetails) => {
    setFilterModel(model);
    if (model.items.length > 0) {
      setCondition((prev) => ({ ...prev, ...{ filter_field: model.items[0].field, filter_operator: model.items[0].operator, filter_value: model.items[0].value } } as MallProductCommentQueryCondition));
    }
  }

  const refreshData = () => {
    queryRecords(condition);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('mall:product:comment:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
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
      <MallProductCommentAdd ref={addMallProductComment} onSubmit={refreshData} />
      <MallProductCommentEdit ref={editMallProductComment} onSubmit={refreshData} />
      <MallProductCommentDelete ref={deleteMallProductComment} onSubmit={refreshData} />
    </Box>
  );
}