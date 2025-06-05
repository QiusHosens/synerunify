import { CaptchaCheckRequest, checkData, getData } from "@/api";
import { useMessage } from "@/components/GlobalMessage";
import { Dialog, DialogContent, DialogProps } from "@mui/material";
import GoCaptcha from "go-captcha-react";
import { ClickData, ClickDot } from "go-captcha-react/dist/components/Click/meta/data";
import { RotateData } from "go-captcha-react/dist/components/Rotate/meta/data";
import { SlideData, SlidePoint } from "go-captcha-react/dist/components/Slide/meta/data";
import { SlideRegionData, SlideRegionPoint } from "go-captcha-react/dist/components/SlideRegion/meta/data";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
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
    onSubmit: () => void;
}

const CaptchaDialog = forwardRef(({ onSubmit }: CaptchaDialogProps, ref) => {
    const { t } = useTranslation();
    const { showMessage } = useMessage();

    const [open, setOpen] = useState(false);
    const [maxWidth] = useState<DialogProps['maxWidth']>('sm');

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
            initCaptcha();
            setOpen(true);
        },
        hide() {
            setOpen(false);
        },
    }));

    const initCaptcha = async () => {
        let id = 'click-default-ch';
        id = 'rotate-default';
        const idType = CAPTCHA_ID_MAP[id];
        setIdType(idType);

        const result = await getData(id);
        console.log('captcha', result);

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
                    thumbY: 0,
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

    const handleClick = (x: number, y: number) => {

    }

    const handleClickConfirm = async (dots: Array<ClickDot>, reset: () => void) => {
        console.log('click confirm', dots);
        let value = '';
        for (let dot of dots) {
            value = ',' + dot.x + ',' + dot.y;
        }
        value = value.substring(1);
        return await handleConfirm(value);
    }

    const handleMove = (x: number, y: number) => {

    }

    const handleSlideConfirm = async (point: SlidePoint, reset: () => void) => {
        console.log('slide confirm', point);
        const value = point.x + ',' + point.y;
        return await handleConfirm(value);
    }

    const handleSlideRegionConfirm = async (point: SlideRegionPoint, reset: () => void) => {
        console.log('slide region confirm', point);
        const value = point.x + ',' + point.y;
        return await handleConfirm(value);
    }

    const handleRotate = (angle: number) => {

    }

    const handleRotateConfirm = async (angle: number, reset: () => void) => {
        console.log('rotate confirm', angle);
        return await handleConfirm(String(angle));
    }

    const handleRefresh = () => {

    }

    const handleConfirm = async (value: string): Promise<boolean> => {
        if (checkRequest) {
            const result = await checkData({
                ...checkRequest,
                value: value
            });
            console.log('confirm result', result);
            if (result == 'ok') {
                showMessage('验证成功', 'success', 3000);
                onSubmit();
            } else {
                showMessage('验证失败,请重试', 'error', 3000);
                handleRefresh();
            }
            return result == 'ok';
        }
        return false;
    }

    return (
        <Dialog
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
        >
            <DialogContent>
                {(idType == 1 || idType == 2) && clickData && <GoCaptcha.Click
                    config={{}}
                    data={clickData}
                    events={{
                        click: handleClick,
                        refresh: handleRefresh,
                        close: handleClose,
                        confirm: handleClickConfirm
                    }}
                    ref={clickRef}
                />}
                {idType == 3 && slideData && <GoCaptcha.Slide
                    config={{}}
                    data={slideData}
                    events={{
                        move: handleMove,
                        refresh: handleRefresh,
                        close: handleClose,
                        confirm: handleSlideConfirm
                    }}
                    ref={slideRef}
                />}
                {idType == 4 && slideRegionData && <GoCaptcha.SlideRegion
                    config={{}}
                    data={slideRegionData}
                    events={{
                        move: handleMove,
                        refresh: handleRefresh,
                        close: handleClose,
                        confirm: handleSlideRegionConfirm
                    }}
                    ref={slideRegionRef}
                />}
                {idType == 5 && rotateData && <GoCaptcha.Rotate
                    config={{}}
                    data={rotateData}
                    events={{
                        rotate: handleRotate,
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