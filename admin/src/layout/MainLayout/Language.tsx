import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { alpha, Box, IconButton, Menu, Stack, SvgIcon, useTheme } from '@mui/material';
import CountryCNIcon from '@/assets/image/svg/CN.svg';
import CountryGBIcon from '@/assets/image/svg/GB.svg';
import CountryFRIcon from '@/assets/image/svg/FR.svg';
import CountrySAIcon from '@/assets/image/svg/SA.svg';

const Language = () => {
    const theme = useTheme();
    const { t, i18n } = useTranslation();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (lng: string) => {
        i18n.changeLanguage(lng);
        // handleClose();
    };

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleLanguageClick}
            >
                {/* <SettingsIcon /> */}
                <SvgIcon sx={{ borderRadius: '6px', height: 'auto' }} width={513} height={342} fontSize='medium' inheritViewBox component={i18n.language === 'zh' ? CountryCNIcon : i18n.language === 'en' ? CountryGBIcon : i18n.language === 'fr' ? CountryFRIcon : CountrySAIcon} />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ '& .MuiMenu-paper': { p: 0.5 }, '& .MuiList-root': { pt: 0, pb: 0 } }}
            >
                <Stack sx={{ gap: 0.5 }}>
                    <Stack direction="row" sx={{ gap: 2, p: 0.75, cursor: 'pointer', borderRadius: '6px', backgroundColor: (i18n.language === 'zh' ? `${alpha(theme.palette.primary.main, 0.12)}` : 'unset') }} onClick={() => handleLanguageChange('zh')}>
                        <SvgIcon component={CountryCNIcon} width={513} height={342} inheritViewBox sx={{ borderRadius: '6px', height: 'auto' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: (i18n.language === 'zh' ? '500' : '400') }}>
                            中文
                        </Box>
                    </Stack>
                    <Stack direction="row" sx={{ gap: 2, p: 0.75, cursor: 'pointer', borderRadius: '6px', backgroundColor: (i18n.language === 'en' ? `${alpha(theme.palette.primary.main, 0.12)}` : 'unset') }} onClick={() => handleLanguageChange('en')}>
                        <SvgIcon component={CountryGBIcon} width={513} height={342} inheritViewBox sx={{ borderRadius: '6px', height: 'auto' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: (i18n.language === 'en' ? '500' : '400') }}>
                            English
                        </Box>
                    </Stack>
                    <Stack direction="row" sx={{ gap: 2, p: 0.75, cursor: 'pointer', borderRadius: '6px', backgroundColor: (i18n.language === 'fr' ? `${alpha(theme.palette.primary.main, 0.12)}` : 'unset') }} onClick={() => handleLanguageChange('fr')}>
                        <SvgIcon component={CountryFRIcon} width={513} height={342} inheritViewBox sx={{ borderRadius: '6px', height: 'auto' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: (i18n.language === 'fr' ? '500' : '400') }}>
                            Français
                        </Box>
                    </Stack>
                    <Stack direction="row" sx={{ gap: 2, p: 0.75, cursor: 'pointer', borderRadius: '6px', backgroundColor: (i18n.language === 'ar' ? `${alpha(theme.palette.primary.main, 0.12)}` : 'unset') }} onClick={() => handleLanguageChange('ar')}>
                        <SvgIcon component={CountrySAIcon} width={513} height={342} inheritViewBox sx={{ borderRadius: '6px', height: 'auto' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', fontWeight: (i18n.language === 'ar' ? '500' : '400') }}>
                            Arabic
                        </Box>
                    </Stack>
                </Stack>
                {/* <MenuItem onClick={() => handleLanguageChange('en')}>
                    English {i18n.language === 'en' && '(Selected)'}
                </MenuItem>
                <MenuItem onClick={() => handleLanguageChange('fr')}>
                    Français {i18n.language === 'fr' && '(Selected)'}
                </MenuItem>
                <MenuItem onClick={() => handleLanguageChange('zh')}>
                    中文 {i18n.language === 'zh' && '(Selected)'}
                </MenuItem> */}
            </Menu>
        </>
    )
}

export default Language;