import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { disableMenu, enableMenu, listMenu, SystemMenuResponse } from '@/api';
import { GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import CustomizedDataGridPro from '@/components/CustomizedDataGridPro';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import MenuAdd from './Add';
import { getParentNodeLists, Node } from '@/utils/treeUtils';
import MenuEdit from './Edit';
import MenuDelete from './Delete';
import CustomizedDictTag from '@/components/CustomizedDictTag';
import { useHomeStore } from '@/store';

export default function MenuManage() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [records, setRecords] = useState<Array<SystemMenuResponse>>([]);
  const [initSortModel] = useState<GridSortModel>([{
    field: 'sort',
    sort: 'asc'
  }]);

  const addMenu = useRef(null);
  const editMenu = useRef(null);
  const deleteMenu = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: SystemMenuResponse) => {
      // console.log('status change', data, checked);

      if (checked) {
        await enableMenu(data.id);
      } else {
        await disableMenu(data.id);
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
    return (status && !hasOperatePermission('config:menu:enable')) || (!status && !hasOperatePermission('config:menu:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("page.menu.title.name"), flex: 1, minWidth: 200 },
      {
        field: 'types',
        // sortable: false,
        // resizable: false,
        filterable: false,
        headerName: t("page.menu.title.type"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <>
            <CustomizedDictTag type='menu_type' value={params.row.type} />
          </>
        )
      },
      { field: 'permission', headerName: t("page.menu.title.permission"), flex: 1, minWidth: 120 },
      {
        field: 'path',
        headerName: t("page.menu.title.path"),
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => (
          <>
            {params.row.path}
          </>
        )
      },
      { field: 'component', headerName: t("page.menu.title.component"), flex: 1, minWidth: 200 },
      { field: 'component_name', headerName: t("page.menu.title.component.name"), flex: 1, minWidth: 150 },
      {
        field: 'sort',
        headerName: t("page.menu.title.sort"),
        flex: 1,
        minWidth: 60,
      },
      {
        field: 'status',
        sortable: false,
        headerName: t("page.menu.title.status"),
        flex: 1,
        minWidth: 80,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            <Switch name="status" checked={!params.row.status} disabled={statusDisabled(params.row.status)} onChange={(event, checked) => handleStatusChange(event, checked, params.row)} />
          </Box>
        ),
      },
      {
        field: 'actions',
        sortable: false,
        resizable: false,
        headerName: t("global.operate.actions"),
        flex: 1,
        minWidth: 100,
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={{ height: '100%', display: 'flex', gap: 1, alignItems: 'center' }}>
            {hasOperatePermission('config:menu:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('page.menu.operate.edit')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('config:menu:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('page.menu.operate.delete')}
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpenDelete(params.row)}
            />}
          </Box>
        ),
      },
    ],
    [t, handleStatusChange]
  );

  const handleClickOpenAdd = () => {
    (addMenu.current as any).show();
  }

  const handleClickOpenEdit = (dict: SystemMenuResponse) => {
    (editMenu.current as any).show(dict);
  };

  const handleClickOpenDelete = (dict: SystemMenuResponse) => {
    (deleteMenu.current as any).show(dict);
  };

  const queryRecords = async () => {
    const result = await listMenu();
    console.log('menu list', result);
    const nodes: Node[] = [];
    result.forEach(menu => {
      nodes.push({
        id: menu.id,
        parent_id: menu.parent_id == 0 ? undefined : menu.parent_id
      } as Node)
    });
    const parentNodeLists = getParentNodeLists(nodes);
    // console.log('parent node list', parentNodeLists);
    result.forEach(menu => {
      const parentNodes = parentNodeLists.get(menu.id);
      menu.hierarchy = [];
      if (parentNodes && parentNodes.length > 0) {
        parentNodes.forEach(node => menu.hierarchy.push(node.id.toString()));
      }
      menu.hierarchy.push(menu.id.toString());
    })
    setRecords(result);
  }

  const getTreeDataPath = (row: any) => row && row.hierarchy;

  const refreshData = () => {
    queryRecords();
  };

  useEffect(() => {
    queryRecords();
  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box></Box>
        {hasOperatePermission('config:menu:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
          {t('global.operate.add')}
        </Button>}
      </Box>
      <CustomizedDataGridPro
        columns={columns}
        initialRows={records}
        getTreeDataPath={getTreeDataPath}
        hideFooter={true}
        initSortModel={initSortModel}
      />
      <MenuAdd ref={addMenu} onSubmit={refreshData} />
      <MenuEdit ref={editMenu} onSubmit={refreshData} />
      <MenuDelete ref={deleteMenu} onSubmit={refreshData} />
    </Box>
  );
}