import React, { useState } from 'react';
import { Box, IconButton, SvgIcon, Tooltip, Typography } from '@mui/material';
import CopyableIcon from '@/assets/image/svg/copyable.svg';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';

interface CustomizedCopyableTextProps {
    text: string;
    label?: string;
}

const CustomizedCopyableText: React.FC<CustomizedCopyableTextProps> = ({ text, label }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center', // 垂直居中
                // justifyContent: 'center', // 水平居中
                height: '100%', // 确保占满单元格高度
                width: '100%', // 确保占满单元格宽度
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    p: 0.5,
                    maxWidth: '100%',
                    overflow: 'hidden',
                }}
            >
                {label && (
                    <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                        {label}
                    </Typography>
                )}
                <Typography
                    // variant="body2"
                    sx={{
                        flex: 1,
                        // overflow: 'hidden',
                        // textOverflow: 'ellipsis',
                        // whiteSpace: 'nowrap',
                        // fontFamily: 'monospace',
                    }}
                >
                    {text}
                </Typography>
                <Tooltip title={copied ? t('global.operate.copied') : t('global.operate.copy')}>
                    <IconButton size="small" onClick={handleCopy}>
                        {copied ? <CheckIcon color="success" sx={{ fontSize: 16 }} /> : <SvgIcon component={CopyableIcon} width={16} height={16} inheritViewBox sx={{ fontSize: 16 }} />}
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default CustomizedCopyableText;