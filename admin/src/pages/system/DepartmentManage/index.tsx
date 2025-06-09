import { Box, Button, Switch } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import CustomizedDataGridPro from '@/components/CustomizedDataGridPro';
import EditIcon from '@/assets/image/svg/edit.svg';
import DeleteIcon from '@/assets/image/svg/delete.svg';
import DepartmentAdd from './Add';
import { getParentNodeLists, Node } from '@/utils/treeUtils';
import MenuEdit from './Edit';
import MenuDelete from './Delete';
import { useHomeStore } from '@/store';
import { disableSystemDepartment, enableSystemDepartment, listSystemDepartment, SystemDepartmentResponse } from '@/api';

export default function DepartmentManage() {
  const { t } = useTranslation();
  const { hasOperatePermission } = useHomeStore();

  const [records, setRecords] = useState<Array<SystemDepartmentResponse>>([]);

  const addDepartment = useRef(null);
  const editMenu = useRef(null);
  const deleteMenu = useRef(null);

  const handleStatusChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, checked: boolean, data: SystemDepartmentResponse) => {
      // console.log('status change', data, checked);

      if (checked) {
        await enableSystemDepartment(data.id);
      } else {
        await disableSystemDepartment(data.id);
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
    return (status && !hasOperatePermission('system:department:enable')) || (!status && !hasOperatePermission('system:department:disable'));
  }

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: t("page.department.title.name"), flex: 1, minWidth: 200 },
      { field: 'leader_user_name', headerName: t("page.department.title.leader.user.name"), flex: 1, minWidth: 120 },
      { field: 'phone', headerName: t("page.department.title.phone"), flex: 1, minWidth: 150 },
      { field: 'email', headerName: t("page.department.title.email"), flex: 1, minWidth: 150 },
      {
        field: 'sort',
        headerName: t("page.department.title.sort"),
        flex: 1,
        minWidth: 60,
      },
      {
        field: 'status',
        sortable: false,
        headerName: t("page.department.title.status"),
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
            {hasOperatePermission('system:department:edit') && <Button
              size="small"
              variant='customOperate'
              title={t('page.department.operate.edit')}
              startIcon={<EditIcon />}
              onClick={() => handleClickOpenEdit(params.row)}
            />}
            {hasOperatePermission('system:department:delete') && <Button
              sx={{ color: 'error.main' }}
              size="small"
              variant='customOperate'
              title={t('page.department.operate.delete')}
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
    (addDepartment.current as any).show();
  }

  const handleClickOpenEdit = (department: SystemDepartmentResponse) => {
    (editMenu.current as any).show(department);
  };

  const handleClickOpenDelete = (department: SystemDepartmentResponse) => {
    (deleteMenu.current as any).show(department);
  };

  const queryRecords = async () => {
    const result = await listSystemDepartment();
    const nodes: Node[] = [];
    result.forEach(department => {
      nodes.push({
        id: department.id,
        parent_id: department.parent_id == 0 ? undefined : department.parent_id
      } as Node)
    });
    const parentNodeLists = getParentNodeLists(nodes);
    // console.log('parent node list', parentNodeLists);
    result.forEach(department => {
      const parentNodes = parentNodeLists.get(department.id);
      department.hierarchy = [];
      if (parentNodes && parentNodes.length > 0) {
        parentNodes.forEach(node => department.hierarchy.push(node.id.toString()));
      }
      department.hierarchy.push(department.id.toString());
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
        {hasOperatePermission('system:department:add') && <Button variant="customContained" onClick={handleClickOpenAdd}>
          {t('global.operate.add')}
        </Button>}
      </Box>
      <CustomizedDataGridPro
        columns={columns}
        initialRows={records}
        getTreeDataPath={getTreeDataPath}
        hideFooter={true}
      />
      <DepartmentAdd ref={addDepartment} onSubmit={refreshData} />
      <MenuEdit ref={editMenu} onSubmit={refreshData} />
      <MenuDelete ref={deleteMenu} onSubmit={refreshData} />
    </Box>
  );
}