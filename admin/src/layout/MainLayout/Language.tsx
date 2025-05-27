import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
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

    useEffect(() => {
        // console.log('language', i18n.language);
    }, [i18n]);

    const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (language: string) => {
        // console.log('language change', language);
        i18n.changeLanguage(language);
        handleClose();
    };

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleLanguageClick}
            >
                <Box sx={{ width: '24px', height: '20px', borderRadius: '5px', overflow: 'hidden', display: 'flex', justifyContent: ((i18n.language === 'zh' || i18n.language === 'zh-CN') ? 'start' : 'center'), alignItems: 'center' }}>
                    <SvgIcon sx={{ width: 'auto' }} width={513} height={342} fontSize='small' inheritViewBox component={(i18n.language === 'zh' || i18n.language === 'zh-CN') ? CountryCNIcon : i18n.language === 'en' ? CountryGBIcon : i18n.language === 'fr' ? CountryFRIcon : CountrySAIcon} />
                </Box>
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
            </Menu>
        </>
    )
}

export default Language;