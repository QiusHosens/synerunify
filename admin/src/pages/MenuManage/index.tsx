import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, InputAdornment, InputLabel, MenuItem, Paper, Select, SvgIcon, Switch, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { listMenu, MenuQueryCondition, pageMenu, SystemMenuResponse } from '@/api';
import { GridColDef, GridSortModel } from '@mui/x-data-grid';
import CustomizedDataGridPro from '@/components/CustomizedDataGridPro';
import SearchIcon from '@/assets/image/svg/search.svg';
import { DialogProps } from '@mui/material/Dialog';
import { SelectChangeEvent } from '@mui/material/Select';

export default function MenuManage() {
  const { t } = useTranslation();

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [pages, setPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>();

  const [records, setRecords] = useState<Array<SystemMenuResponse>>([]);

  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('sm');

  const columns: GridColDef[] = [
    { field: 'name', headerName: t("page.menu.title.name"), width: 200 },
    { field: 'permission', headerName: t("page.menu.title.permission"), width: 200 },
    {
      field: 'type',
      headerName: t("page.menu.title.type"),
      width: 200,
    },
    {
      field: 'sort',
      headerName: t("page.menu.title.sort"),
      // type: 'number',
      width: 200,
    },
  ];

  const queryRecords = async () => {
    let condition: MenuQueryCondition = {
      page,
      size,
      keyword
    };
    let result = await listMenu();
    console.log('menu list', result);
    result.forEach(menu => {
      let path = menu.path;
      let hierarchy = [];
      if (path) {
        let paths = path.split('/');
        for (let p of paths) {
          if (p) {
            hierarchy.push(p);
          }
        }
      }
      menu.hierarchy = hierarchy;
    })
    setRecords(result);
  }

  const getTreeDataPath = (row: any) => row.hierarchy;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMaxWidthChange = (event: SelectChangeEvent<typeof maxWidth>) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };

  const handleFullWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullWidth(event.target.checked);
  };

  useEffect(() => {
    queryRecords();
  }, []);

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', }}>
        <TextField
          label={t('global.condition.keyword')}
          // id="outlined-start-adornment"
          sx={{ m: 0, width: '25ch' }}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">
                <SvgIcon component={SearchIcon} inheritViewBox />
              </InputAdornment>,
            },
          }}
        />
        <Button variant="contained" onClick={handleClickOpen}>{t('global.operate.add')}</Button>
      </Box>
      <Paper sx={{ height: 400, width: '100%' }}>
        <CustomizedDataGridPro
          columns={columns}
          initialRows={records}
          // getTreeDataPath={(row) => row?.path || []}
          getTreeDataPath={getTreeDataPath}
          hideFooter={true}
        />
      </Paper>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{t('global.operate.add')}{t('global.page.menu')}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            You can set my maximum width and whether to adapt or not.
          </DialogContentText> */}
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel htmlFor="max-width">maxWidth</InputLabel>
              <Select
                autoFocus
                value={maxWidth}
                onChange={handleMaxWidthChange}
                label="maxWidth"
                inputProps={{
                  name: 'max-width',
                  id: 'max-width',
                }}
              >
                <MenuItem value={false as any}>false</MenuItem>
                <MenuItem value="xs">xs</MenuItem>
                <MenuItem value="sm">sm</MenuItem>
                <MenuItem value="md">md</MenuItem>
                <MenuItem value="lg">lg</MenuItem>
                <MenuItem value="xl">xl</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              sx={{ mt: 1 }}
              control={
                <Switch checked={fullWidth} onChange={handleFullWidthChange} />
              }
              label="Full width"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('global.operate.confirm')}</Button>
          <Button onClick={handleClose}>{t('global.operate.cancel')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}