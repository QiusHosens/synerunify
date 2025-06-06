import { CaptchaCheckRequest, checkData, getData } from "@/api";
import { useMessage } from "@/components/GlobalMessage";
import { useThemeStore } from "@/store";
import { Dialog, DialogContent, DialogProps } from "@mui/material";
import GoCaptcha from "go-captcha-react";
import { ClickData, ClickDot } from "go-captcha-react/dist/components/Click/meta/data";
import { RotateData } from "go-captcha-react/dist/components/Rotate/meta/data";
import { SlideData, SlidePoint } from "go-captcha-react/dist/components/Slide/meta/data";
import { SlideRegionData, SlideRegionPoint } from "go-captcha-react/dist/components/SlideRegion/meta/data";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// GoCaptchaTypeUnknown    = 0
// GoCaptchaTypeClick      = 1 // 文本点选验证码
// GoCaptchaTypeClickShape = 2 // 图形点选验证码
// GoCaptchaTypeSlide      = 3 // 滑动验证码
// GoCaptchaTypeDrag       = 4 // 拖拽验证码
// GoCaptchaTypeRotate     = 5 // 旋转验证码
const CAPTCHA_ID_MAP: { [key: string]: number } = {
    'click-shape-dark-default': 1, // 1
    'click-dark-en': 1, // 1
    'slide-default': 3, // 3
    'drag-default': 4, // 4
    'rotate-default': 5, // 5
    'click-default-ch': 1, // 1
    'click-default-en': 1, // 1
    'click-shape-light-default': 1, // 1
    'click-dark-ch': 1, // 1
    'click-shape-default': 2, // 2
}

interface CaptchaDialogProps {
    onSubmit: (captchaKey: string) => void;
}

const CaptchaDialog = forwardRef(({ onSubmit }: CaptchaDialogProps, ref) => {
    const { t, i18n } = useTranslation();
    const { mode } = useThemeStore();
    const { showMessage } = useMessage();

    const [open, setOpen] = useState(false);
    const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

    const [config] = useState({ width: 300, height: 220 });
    const [failCount, setFailCount] = useState<number>(0);
    const [id, setId] = useState<string>('click-default-ch');
    const [idType, setIdType] = useState<number>(0);
    const [clickData, setClickData] = useState<ClickData>();
    const [slideData, setSlideData] = useState<SlideData>();
    const [slideRegionData, setSlideRegionData] = useState<SlideRegionData>();
    const [rotateData, setRotateData] = useState<RotateData>();
    const [checkRequest, setCheckRequest] = useState<CaptchaCheckRequest>();

    const clickRef = useRef(null);
    const slideRef = useRef(null);
    const slideRegionRef = useRef(null);
    const rotateRef = useRef(null);

    useImperativeHandle(ref, () => ({
        show() {
            console.log('captcha show');
            refreshId();
            setOpen(true);
        },
        hide() {
            setOpen(false);
        },
    }));

    useEffect(() => {
        refreshId();
    }, [failCount]);

    const refreshId = () => {
        console.log('fail count', failCount);
        let id = 'click-default-ch';
        const count = failCount % 5;
        switch (count) {
            case 0:
                if (mode == 'light') {
                    if (i18n.language === 'en') {
                        id = 'click-default-en';
                        setId('click-default-en');
                    } else {
                        id = 'click-default-ch';
                    }
                } else {
                    if (i18n.language === 'en') {
                        id = 'click-dark-en';
                    } else {
                        id = 'click-dark-ch';
                    }
                }
                break;
            case 1:
                if (mode == 'light') {
                    id = 'click-shape-light-default';
                } else {
                    id = 'click-shape-dark-default';
                }
                break;
            case 2:
                id = 'slide-default';
                break;
            case 3:
                id = 'drag-default';
                break;
            case 4:
                id = 'rotate-default';
                break;
        }
        setId(id);
        refresh(id);
    }

    const refresh = async (id: string) => {
        const idType = CAPTCHA_ID_MAP[id];
        setIdType(idType);
        const result = await getData(id);
        // console.log('captcha', result);

        setCheckRequest({
            id,
            captchaKey: result.captcha_key,
        })

        switch (idType) {
            case 1:
            case 2:
                setClickData({
                    image: result.master_image_base64,
                    thumb: result.thumb_image_base64
                });
                break;
            case 3:
                setSlideData({
                    thumbX: 0,
                    thumbY: result.display_y,
                    thumbWidth: result.thumb_width,
                    thumbHeight: result.thumb_height,
                    image: result.master_image_base64,
                    thumb: result.thumb_image_base64
                });
                break;
            case 4:
                setSlideRegionData({
                    thumbX: 0,
                    thumbY: 0,
                    thumbWidth: result.thumb_width,
                    thumbHeight: result.thumb_height,
                    image: result.master_image_base64,
                    thumb: result.thumb_image_base64
                });
                break;
            case 5:
                setRotateData({
                    angle: 0,
                    image: result.master_image_base64,
                    thumb: result.thumb_image_base64,
                    thumbSize: result.thumb_size
                });
                break;
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickConfirm = async (dots: Array<ClickDot>, reset: () => void) => {
        // console.log('click confirm', dots);
        let value = '';
        for (const dot of dots) {
            value += ',' + dot.x + ',' + dot.y;
        }
        value = value.substring(1);
        const result = await handleConfirm(value);
        if (!result) {
            reset();
        }
        return result;
    }

    const handleSlideConfirm = async (point: SlidePoint, reset: () => void) => {
        // console.log('slide confirm', point);
        const value = point.x + ',' + point.y;
        const result = await handleConfirm(value);
        if (!result) {
            reset();
        }
        return result;
    }

    const handleSlideRegionConfirm = async (point: SlideRegionPoint, reset: () => void) => {
        // console.log('slide region confirm', point);
        const value = point.x + ',' + point.y;
        const result = await handleConfirm(value);
        if (!result) {
            reset();
        }
        return result;
    }

    const handleRotateConfirm = async (angle: number, reset: () => void) => {
        // console.log('rotate confirm', angle);
        const result = await handleConfirm(String(angle));
        if (!result) {
            reset();
        }
        return result;
    }

    const handleFailure = () => {
        setFailCount(failCount + 1);
    }

    const handleRefresh = () => {
        refresh(id);
    }

    const handleConfirm = async (value: string): Promise<boolean> => {
        if (checkRequest) {
            const result = await checkData({
                ...checkRequest,
                value: value
            });
            // console.log('confirm result', result);
            if (result == 'ok') {
                showMessage(t('page.login.message.captcha.success'), 'success', 3000);
                onSubmit(checkRequest.captchaKey);
            } else {
                showMessage(t('page.login.message.captcha.failure'), 'error', 3000);
                handleFailure();
            }
            return result == 'ok';
        }
        return false;
    }

    return (
        <Dialog
            // fullWidth={true}
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
        >
            <DialogContent sx={{ p: 0 }}>
                {(idType == 1 || idType == 2) && clickData && <GoCaptcha.Click
                    config={config}
                    data={clickData}
                    events={{
                        // click: handleClick,
                        refresh: handleRefresh,
                        close: handleClose,
                        confirm: handleClickConfirm
                    }}
                    ref={clickRef}
                />}
                {idType == 3 && slideData && <GoCaptcha.Slide
                    config={config}
                    data={slideData}
                    events={{
                        // move: handleMove,
                        refresh: handleRefresh,
                        close: handleClose,
                        confirm: handleSlideConfirm
                    }}
                    ref={slideRef}
                />}
                {idType == 4 && slideRegionData && <GoCaptcha.SlideRegion
                    config={config}
                    data={slideRegionData}
                    events={{
                        // move: handleMove,
                        refresh: handleRefresh,
                        close: handleClose,
                        confirm: handleSlideRegionConfirm
                    }}
                    ref={slideRegionRef}
                />}
                {idType == 5 && rotateData && <GoCaptcha.Rotate
                    config={config}
                    data={rotateData}
                    events={{
                        // rotate: handleRotate,
                        refresh: handleRefresh,
                        close: handleClose,
                        confirm: handleRotateConfirm
                    }}
                    ref={rotateRef}
                />}
            </DialogContent>
        </Dialog>
    )
});

export default CaptchaDialog;