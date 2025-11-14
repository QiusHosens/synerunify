import { uploadSystemFileOss } from '@/api/system_file';
import CustomizedFileUpload, { UploadFile } from '@/components/CustomizedFileUpload';
import { Box } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormValues {
  path: string; // 文件地址

  file?: UploadFile | null;
}

export default function Detection() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<FormValues>({
    path: '',
  });

  const [fileWidth] = useState<number>(420);
  const [fileHeight] = useState<number>(245);

  const handleFileChange = useCallback(async (file: UploadFile | null, action: 'upload' | 'remove') => {
    if (action === 'upload' && file) {
      // 更新文件列表,增加一个附件,等待上传完成后在写入信息
      setFormValues((prev) => {
        return { ...prev, file };
      })

      // 上传文件
      try {
        const result = await uploadSystemFileOss(file.file, (progress) => {
          setFormValues((prev) => {
            return { ...prev, file: { ...prev.file!, progress } };
          });
        });

        // 上传完成
        setFormValues((prev) => {
          return { ...prev, path: result, file: { ...prev.file!, status: 'done' as const } };
        });
      } catch (error) {
        console.error('upload file error', error);
        // 上传失败
        setFormValues((prev) => {
          return { ...prev, file: { ...prev.file!, status: 'error' as const } };
        });
      }
    } else if (action === 'remove') {
      // 删除文件并移除上传框
      setFormValues((prev) => {
        return { ...prev, file: undefined };
      });
    }
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        background:
          'radial-gradient(circle at top, rgba(63, 81, 181, 0.15), rgba(13, 71, 161, 0.05))',
      }}>
      <CustomizedFileUpload
        canRemove={false}
        id={'file-upload'}
        accept=".jpg,jpeg,.png"
        maxSize={100}
        onChange={(file, action) => handleFileChange(file, action)}
        file={formValues.file}
        width={fileWidth}
        height={fileHeight}
      />
    </Box>
  );
}

