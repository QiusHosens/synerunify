import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  DialogActions,
  Alert,
  AlertTitle,
} from '@mui/material';
import CustomizedDialog from './CustomizedDialog';
import CustomizedAnchor, { AnchorLinkProps } from './CustomizedAnchor';

// Dialog中的锚点数据
const dialogAnchorItems: AnchorLinkProps[] = [
  {
    href: '#dialog-section1',
    title: '第一节',
  },
  {
    href: '#dialog-section2',
    title: '第二节',
    children: [
      {
        href: '#dialog-subsection2-1',
        title: '2.1 子节',
      },
      {
        href: '#dialog-subsection2-2',
        title: '2.2 子节',
      },
    ],
  },
  {
    href: '#dialog-section3',
    title: '第三节',
  },
  {
    href: '#dialog-section4',
    title: '第四节',
    children: [
      {
        href: '#dialog-subsection4-1',
        title: '4.1 子节',
      },
      {
        href: '#dialog-subsection4-2',
        title: '4.2 子节',
      },
    ],
  },
  {
    href: '#dialog-section5',
    title: '第五节',
  },
];

const CustomizedAnchorDialogExample: React.FC = () => {
  const [open, setOpen] = useState(false);
  const contentAreaRef = React.useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    console.log('open', open);
    if (open) {
      setTimeout(() => {
        if (contentAreaRef.current) {
          setIsMounted(true);
        }
      })
    }
  }, [open, contentAreaRef.current]);

  return (
    <Box>
      <Button variant="contained" onClick={handleOpen}>
        打开带锚点导航的对话框
      </Button>

      <CustomizedDialog
        open={open}
        onClose={handleClose}
        title="锚点导航示例对话框"
        maxWidth="lg"
        actions={
          <DialogActions>
            <Button onClick={handleClose}>关闭</Button>
          </DialogActions>
        }
        TransitionProps={{
          onEntered: () => {
            if (contentAreaRef.current) {
              setIsMounted(true);
            }
          },
        }}
      >
        <Box display="flex" sx={{ height: '70vh' }}>
          {/* 左侧锚点导航 */}
          <Box
            sx={{
              width: 240,
              flexShrink: 0,
              borderRight: 1,
              borderColor: 'divider',
              pr: 2,
              mr: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              目录导航
            </Typography>
            {isMounted && contentAreaRef.current && <CustomizedAnchor
              items={dialogAnchorItems}
              offsetTop={0}
              showInkInFixed={true}
              getContainer={() => {
                // 使用ref获取滚动容器，更加准确
                console.log('获取滚动容器:', contentAreaRef.current);
                return contentAreaRef.current || window;
              }}
              // getContainer={
              //   contentAreaRef.current ? () => contentAreaRef.current! : undefined
              // }
              // getContainer={() => container || window}
              onChange={(activeLink) => {
                console.log('Dialog中当前活动锚点:', activeLink);
              }}
              onClick={(e, link) => {
                console.log('Dialog中点击锚点:', link);
              }}
            />}
          </Box>

          {/* 右侧内容区域 */}
          <Box
            ref={contentAreaRef}
            className="dialog-content-area"
            sx={{ flex: 1, overflow: 'auto' }}
          >
            {/* 说明提示 */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Dialog中的锚点导航</AlertTitle>
              此示例展示了CustomizedAnchor组件在Dialog中的使用。
              组件已经过优化，支持在模态框等特殊容器中正常工作。
            </Alert>

            {/* 第一节 */}
            <Box id="dialog-section1" sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                第一节：基础介绍
              </Typography>
              <Typography variant="body1" paragraph>
                这是在Dialog中使用CustomizedAnchor组件的示例。该组件已经经过优化，
                可以在Dialog等特殊容器中正常工作。
              </Typography>
              {Array.from({ length: 8 }, (_, i) => (
                <Typography key={i} variant="body2" paragraph>
                  第一节内容 {i + 1}。这里展示了如何在Dialog中使用锚点导航。
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
              ))}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 第二节 */}
            <Box id="dialog-section2" sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                第二节：高级功能
              </Typography>

              <Box id="dialog-subsection2-1" sx={{ mb: 3 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  2.1 嵌套锚点
                </Typography>
                <Typography variant="body1" paragraph>
                  支持多级嵌套的锚点结构，可以构建复杂的文档导航。
                </Typography>
                {Array.from({ length: 5 }, (_, i) => (
                  <Typography key={i} variant="body2" paragraph>
                    2.1节内容 {i + 1}。展示嵌套锚点的功能。
                  </Typography>
                ))}
              </Box>

              <Box id="dialog-subsection2-2" sx={{ mb: 3 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  2.2 自动高亮
                </Typography>
                <Typography variant="body1" paragraph>
                  随着滚动自动高亮当前位置的锚点，提供清晰的导航指示。
                </Typography>
                {Array.from({ length: 5 }, (_, i) => (
                  <Typography key={i} variant="body2" paragraph>
                    2.2节内容 {i + 1}。展示自动高亮功能。
                  </Typography>
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 第三节 */}
            <Box id="dialog-section3" sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                第三节：配置选项
              </Typography>
              <Typography variant="body1" paragraph>
                CustomizedAnchor提供了丰富的配置选项，可以适应不同的使用场景。
              </Typography>
              {Array.from({ length: 10 }, (_, i) => (
                <Typography key={i} variant="body2" paragraph>
                  第三节内容 {i + 1}。详细的配置说明和使用指南。
                  可以配置偏移量、边界值、滚动容器等多个参数。
                </Typography>
              ))}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 第四节 */}
            <Box id="dialog-section4" sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                第四节：最佳实践
              </Typography>

              <Box id="dialog-subsection4-1" sx={{ mb: 3 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  4.1 性能优化
                </Typography>
                <Typography variant="body1" paragraph>
                  在Dialog中使用时的性能考量和优化建议。
                </Typography>
                {Array.from({ length: 6 }, (_, i) => (
                  <Typography key={i} variant="body2" paragraph>
                    4.1节内容 {i + 1}。性能优化相关的内容和建议。
                  </Typography>
                ))}
              </Box>

              <Box id="dialog-subsection4-2" sx={{ mb: 3 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  4.2 响应式设计
                </Typography>
                <Typography variant="body1" paragraph>
                  如何在不同屏幕尺寸下保持良好的用户体验。
                </Typography>
                {Array.from({ length: 6 }, (_, i) => (
                  <Typography key={i} variant="body2" paragraph>
                    4.2节内容 {i + 1}。响应式设计的考量和实现。
                  </Typography>
                ))}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* 第五节 */}
            <Box id="dialog-section5" sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                第五节：总结
              </Typography>
              <Typography variant="body1" paragraph>
                总结CustomizedAnchor在Dialog中的使用方法和注意事项。
              </Typography>
              {Array.from({ length: 8 }, (_, i) => (
                <Typography key={i} variant="body2" paragraph>
                  第五节内容 {i + 1}。总结和展望。感谢使用CustomizedAnchor组件！
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </CustomizedDialog>
    </Box>
  );
};

export default CustomizedAnchorDialogExample;
