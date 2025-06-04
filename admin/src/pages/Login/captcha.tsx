import { getData } from "@/api/captcha";
import { Dialog, DialogContent, DialogProps } from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";

const CaptchaDialog = forwardRef(({}, ref) => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [fullWidth] = useState(true);
    const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

    useImperativeHandle(ref, () => ({
        show() {
            console.log('captcha show');
            initCaptcha();
            setOpen(true);
        },
        hide() {
            setOpen(false);
        },
    }));

    const initCaptcha = async () => {
        const result = await getData();
        console.log('captcha', result);
    }

    const handleCancel = () => {
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
        >
            <DialogContent>

            </DialogContent>
        </Dialog>
    )
});

export default CaptchaDialog;