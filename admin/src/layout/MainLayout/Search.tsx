import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { SvgIcon, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@/assets/image/svg/search.svg';

export default function Search() {
  const { t } = useTranslation();
  
  return (
    <FormControl sx={{ width: { xs: '100%' }, '& .MuiTextField-root': { width: '200px' } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Search…"
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            {/* <SearchRoundedIcon fontSize="small" /> */}
            <SvgIcon component={SearchIcon} />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search',
        }}
      />
      {/* <TextField
        size="small"
        sx={{ m: 0, width: '200px' }}
        label={t('global.condition.keyword')}
        name="keyword"
        // value={condition.keyword}
        // onChange={handleInputChange}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon component={SearchIcon} />
              </InputAdornment>
            ),
          },
        }}
      /> */}
    </FormControl>
  );
}
