import { SystemRoleDataRuleRequest, SystemRoleResponse, updateSystemRoleRule } from "@/api";
import { listSystemDataScopeRule, SystemDataScopeRuleResponse } from "@/api/system_data_scope_rule";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import { forwardRef, ReactNode, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

interface RoleDataSettingProps {
  onSubmit: () => void;
}

const RoleDataSetting = forwardRef(({ onSubmit }: RoleDataSettingProps, ref) => {

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

  const [role, setRole] = useState<SystemRoleResponse>();
  const [ruleId, setRuleId] = useState<string>();
  const [rules, setRules] = useState<SystemDataScopeRuleResponse[]>([]);

  useImperativeHandle(ref, () => ({
    show(role: SystemRoleResponse) {
      setRole(role);
      setRuleId(String(role.data_scope_rule_id));
      initRules();
      setOpen(true);
    },
    hide() {
      setOpen(false);
    },
  }));

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const reset = () => {

  }

  const initRules = async () => {
    const result = await listSystemDataScopeRule();
    setRules(result);
  }

  const handleSubmit = async () => {
    if (!role) {
      return;
    }

    const roleRule: SystemRoleDataRuleRequest = {
      id: role.id,
      data_scope_rule_id: Number(ruleId),
    }
    await updateSystemRoleRule(roleRule);
    handleClose();
    onSubmit();
  };

  const handleRuleChange = (e: SelectChangeEvent<string>, child: ReactNode) => {
    const { name, value } = e.target;
    setRuleId(value);
  }

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{t('page.role.operate.data')}</DialogTitle>
      <DialogContent>
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
          <FormControl sx={{ mt: 2, minWidth: 120, '& .MuiStack-root': { mt: 2, width: '200px' } }}>
            <Stack direction="row" spacing={2}>
              <Box>{t('global.page.role')}{t('page.role.title.name')}</Box>
              <Box>{role && role.name}</Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Box>{t('global.page.role')}{t('page.role.title.code')}</Box>
              <Box>{role && role.code}</Box>
            </Stack>
          </FormControl>
          <FormControl sx={{ mt: 3, minWidth: 120, '& .MuiSelect-root': { width: '200px' } }}>
            <InputLabel required size="small" id="rule-select-label">{t("page.role.operate.data")}</InputLabel>
            <Select
              required
              size="small"
              classes={{ select: 'CustomSelectSelect' }}
              labelId="rule-select-label"
              name="dict_type"
              value={ruleId}
              onChange={handleRuleChange}
              label={t("page.role.operate.data")}
            >
              {rules.map(item => (<MenuItem key={item.id} value={item.id.toString()}>{item.name}</MenuItem>))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>{t('global.operate.confirm')}</Button>
        <Button onClick={handleCancel}>{t('global.operate.cancel')}</Button>
      </DialogActions>
    </Dialog >
  )
});

export default RoleDataSetting;