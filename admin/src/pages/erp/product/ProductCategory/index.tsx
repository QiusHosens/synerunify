import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import { disableErpProductCategory, enableErpProductCategory, ErpProductCategoryResponse, listErpProductCategory } from '@/api';
import ErpProductCategoryAdd from './Add';
import ErpProductCategoryEdit from './Edit';
import ErpProductCategoryDelete from './Delete';
import { useHomeStore } from '@/store';
import CustomizedDataGridPro from '@/components/CustomizedDataGridPro';
import { getParentNodeLists, Node } from '@/utils/treeUtils';

export default function ErpProductCategory() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [records, setRecords] = useState<Array<ErpProductCategoryResponse>>([]);
  const [sortModel] = useState<GridSortModel>([]);

  const addErpProductCategory = useRef(null);
  const editErpProductCategory = useRef(null);
  const deleteErpProductCategory = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: ErpProductCategoryResponse) => {
      if (checked) {
        await enableErpProductCategory(data.id);
      } else {
        await disableErpProductCategory(data.id);
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
    return (status && !hasOperatePermission('erp:product:category:enable')) || (!status && !hasOperatePermission('erp:product:category:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("page.erp.product.category.title.name"), flex: 2, minWidth: 200 },
      { field: 'code', headerName: t("page.erp.product.category.title.code"), flex: 1, minWidth: 100 },
      { field: 'sort', headerName: t("page.erp.product.category.title.sort"), flex: 1, minWidth: 60 },
      { field: 'remarks', headerName: t("page.erp.product.category.title.remarks"), flex: 1, minWidth: 100 },
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
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            {hasOperatePermission('erp:product:category:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('global.operate.edit') + t('global.page.erp.product.category')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('erp:product:category:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('global.operate.delete') + t('global.page.erp.product.category')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </Box>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const queryRecords = async () => {
    const result = await listErpProductCategory();
    const nodes: Node[] = [];
    result.forEach(category => {
      nodes.push({
        id: category.id,
        parent_id: category.parent_id == 0 ? undefined : category.parent_id
      } as Node)
    });
    const parentNodeLists = getParentNodeLists(nodes);
    result.forEach(category => {
      const parentNodes = parentNodeLists.get(category.id);
      category.hierarchy = [];
      if (parentNodes && parentNodes.length > 0) {
        parentNodes.forEach(node => category.hierarchy.push(node.id.toString()));
      }
      category.hierarchy.push(category.id.toString());
    })
    setRecords(result);
  };

  const handleClickOpenAdd = () => {
    (addErpProductCategory.current as any).show();
  }

  const handleClickOpenEdit = (erpProductCategory: ErpProductCategoryResponse) => {
    (editErpProductCategory.current as any).show(erpProductCategory);
  };

  const handleClickOpenDelete = (erpProductCategory: ErpProductCategoryResponse) => {
    (deleteErpProductCategory.current as any).show(erpProductCategory);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getTreeDataPath = (row: any) => row && row.hierarchy;

  const refreshData = () => {
    queryRecords();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('erp:product:category:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
          {t('global.operate.add')}
        </Button>}
      </Box>
      <CustomizedDataGridPro
        columns={columns}
        initialRows={records}
        getTreeDataPath={getTreeDataPath}
        hideFooter={true}
        initSortModel={sortModel}
      />
      <ErpProductCategoryAdd ref={addErpProductCategory} onSubmit={refreshData} />
      <ErpProductCategoryEdit ref={editErpProductCategory} onSubmit={refreshData} />
      <ErpProductCategoryDelete ref={deleteErpProductCategory} onSubmit={refreshData} />
    </Box>
  );
}