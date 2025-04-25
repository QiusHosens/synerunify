import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { SelectChangeEvent } from '@mui/material/Select';

const MenuAdd = forwardRef((props, ref) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<number>(1);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('sm');

  useImperativeHandle(ref, () => ({
    show() {
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTypeChange = (event: SelectChangeEvent<number>) => {
    setType(event.target.value as number);
  }

  // const handleMaxWidthChange = (event: SelectChangeEvent<typeof maxWidth>) => {
  //   setMaxWidth(
  //     // @ts-expect-error autofill of arbitrary value is not handled.
  //     event.target.value,
  //   );
  // };

  // const handleFullWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFullWidth(event.target.checked);
  // };

  return (
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
          <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiTextField-root': { m: 1, width: '200px' }, '& .MuiSelect-root': { m: 1, width: '200px' } }}>
            <TextField label={t("page.menu.title.name")} />
            <TextField label={t("page.menu.title.permission")} />
            <InputLabel id="menu-type-select-label">{t("page.menu.title.type")}</InputLabel>
            <Select
              labelId="menu-type-select-label"
              value={type}
              onChange={handleTypeChange}
              label={t("page.menu.title.type")}
            // inputProps={{
            //   name: 'max-width',
            //   id: 'max-width',
            // }}
            >
              <MenuItem value={1}>菜单组</MenuItem>
              <MenuItem value={2}>菜单</MenuItem>
              <MenuItem value={3}>操作</MenuItem>
            </Select>
            {/* <Select
              autoFocus
              value={maxWidth}
              onChange={handleMaxWidthChange}
              label={t("page.menu.title.type")}
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
            </Select> */}
          </FormControl>
          {/* <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Switch checked={fullWidth} onChange={handleFullWidthChange} />
            }
            label="Full width"
          /> */}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('global.operate.confirm')}</Button>
        <Button onClick={handleClose}>{t('global.operate.cancel')}</Button>
      </DialogActions>
    </Dialog>
  )
});

export default MenuAdd;