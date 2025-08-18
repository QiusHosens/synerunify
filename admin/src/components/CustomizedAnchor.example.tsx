import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';
import CustomizedAnchor, { AnchorLinkProps } from './CustomizedAnchor';

// 示例数据
const anchorItems: AnchorLinkProps[] = [
  {
    href: '#introduction',
    title: '介绍',
  },
  {
    href: '#installation',
    title: '安装',
    children: [
      {
        href: '#npm-install',
        title: 'NPM 安装',
      },
      {
        href: '#yarn-install',
        title: 'Yarn 安装',
      },
    ],
  },
  {
    href: '#usage',
    title: '使用方法',
    children: [
      {
        href: '#basic-usage',
        title: '基本用法',
      },
      {
        href: '#advanced-usage',
        title: '高级用法',
      },
    ],
  },
  {
    href: '#api',
    title: 'API 文档',
  },
  {
    href: '#examples',
    title: '示例',
    children: [
      {
        href: '#example-1',
        title: '示例 1: 基础锚点',
      },
      {
        href: '#example-2',
        title: '示例 2: 嵌套锚点',
      },
    ],
  },
  {
    href: '#faq',
    title: '常见问题',
  },
];

const CustomizedAnchorExample: React.FC = () => {
  return (
    <Box display="flex" sx={{ minHeight: '100vh' }}>
      {/* 左侧内容区域 */}
      <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
        <Box id="introduction" sx={{ mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            介绍
          </Typography>
          <Typography variant="body1" paragraph>
            这是一个基于 Material-UI 和 TypeScript 开发的自定义 Anchor 组件，
            提供了与 Ant Design Anchor 组件相同的功能特性。
          </Typography>
          <Typography variant="body1" paragraph>
            主要特性包括：自动高亮当前位置、平滑滚动、嵌套锚点链接、
            可配置偏移量、自定义样式等。
          </Typography>
          {/* 填充内容以便滚动 */}
          {Array.from({ length: 8 }, (_, i) => (
            <Typography key={i} variant="body2" paragraph>
              这是介绍部分的填充内容 {i + 1}。Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
              et dolore magna aliqua.
            </Typography>
          ))}
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box id="installation" sx={{ mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            安装
          </Typography>

          <Box id="npm-install" sx={{ mb: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              NPM 安装
            </Typography>
            <Typography variant="body1" paragraph>
              使用 npm 安装依赖包：
            </Typography>
            <Box
              component="pre"
              sx={{
                backgroundColor: 'grey.100',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
              }}
            >
              <code>npm install @mui/material @emotion/react @emotion/styled</code>
            </Box>
            {Array.from({ length: 6 }, (_, i) => (
              <Typography key={i} variant="body2" paragraph>
                NPM 安装的填充内容 {i + 1}。详细的安装说明和配置选项。
              </Typography>
            ))}
          </Box>

          <Box id="yarn-install" sx={{ mb: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Yarn 安装
            </Typography>
            <Typography variant="body1" paragraph>
              使用 Yarn 安装依赖包：
            </Typography>
            <Box
              component="pre"
              sx={{
                backgroundColor: 'grey.100',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
              }}
            >
              <code>yarn add @mui/material @emotion/react @emotion/styled</code>
            </Box>
            {Array.from({ length: 6 }, (_, i) => (
              <Typography key={i} variant="body2" paragraph>
                Yarn 安装的填充内容 {i + 1}。详细的安装说明和配置选项。
              </Typography>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box id="usage" sx={{ mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            使用方法
          </Typography>

          <Box id="basic-usage" sx={{ mb: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              基本用法
            </Typography>
            <Typography variant="body1" paragraph>
              基本的 Anchor 组件使用示例：
            </Typography>
            <Box
              component="pre"
              sx={{
                backgroundColor: 'grey.100',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                fontSize: '0.875rem',
              }}
            >
              <code>{`<CustomizedAnchor
  items={[
    { href: '#section1', title: '第一节' },
    { href: '#section2', title: '第二节' },
  ]}
  offsetTop={60}
/>`}</code>
            </Box>
            {Array.from({ length: 5 }, (_, i) => (
              <Typography key={i} variant="body2" paragraph>
                基本用法的填充内容 {i + 1}。详细的使用说明和注意事项。
              </Typography>
            ))}
          </Box>

          <Box id="advanced-usage" sx={{ mb: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              高级用法
            </Typography>
            <Typography variant="body1" paragraph>
              高级功能包括嵌套链接、自定义样式等：
            </Typography>
            <Box
              component="pre"
              sx={{
                backgroundColor: 'grey.100',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                fontSize: '0.875rem',
              }}
            >
              <code>{`<CustomizedAnchor
  items={items}
  fixed
  position={{ top: 100, right: 20 }}
  offsetTop={80}
  onChange={(activeLink) => console.log(activeLink)}
/>`}</code>
            </Box>
            {Array.from({ length: 5 }, (_, i) => (
              <Typography key={i} variant="body2" paragraph>
                高级用法的填充内容 {i + 1}。详细的配置说明和最佳实践。
              </Typography>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box id="api" sx={{ mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            API 文档
          </Typography>
          <Typography variant="body1" paragraph>
            完整的 API 文档和属性说明：
          </Typography>
          {Array.from({ length: 10 }, (_, i) => (
            <Typography key={i} variant="body2" paragraph>
              API 文档的填充内容 {i + 1}。详细的参数说明、类型定义和使用示例。
            </Typography>
          ))}
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box id="examples" sx={{ mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            示例
          </Typography>

          <Box id="example-1" sx={{ mb: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              示例 1: 基础锚点
            </Typography>
            <Typography variant="body1" paragraph>
              最简单的锚点使用示例：
            </Typography>
            {Array.from({ length: 6 }, (_, i) => (
              <Typography key={i} variant="body2" paragraph>
                示例 1 的填充内容 {i + 1}。基础锚点的实现和效果展示。
              </Typography>
            ))}
          </Box>

          <Box id="example-2" sx={{ mb: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              示例 2: 嵌套锚点
            </Typography>
            <Typography variant="body1" paragraph>
              带有嵌套结构的锚点示例：
            </Typography>
            {Array.from({ length: 6 }, (_, i) => (
              <Typography key={i} variant="body2" paragraph>
                示例 2 的填充内容 {i + 1}。嵌套锚点的配置和层级展示。
              </Typography>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box id="faq" sx={{ mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            常见问题
          </Typography>
          <Typography variant="body1" paragraph>
            使用过程中的常见问题和解决方案：
          </Typography>
          {Array.from({ length: 8 }, (_, i) => (
            <Typography key={i} variant="body2" paragraph>
              常见问题的填充内容 {i + 1}。问题描述、原因分析和解决方案。
            </Typography>
          ))}
        </Box>
      </Container>

      {/* 右侧锚点导航 - 固定模式 */}
      <CustomizedAnchor
        items={anchorItems}
        fixed
        position={{ top: 100, right: 20 }}
        offsetTop={80}
        showInkInFixed
        onChange={(activeLink) => {
          console.log('当前活动锚点:', activeLink);
        }}
        onClick={(e, link) => {
          console.log('点击锚点:', link);
        }}
      />

      {/* 左侧锚点导航 - 内联模式示例 */}
      <Box
        sx={{
          position: 'fixed',
          left: 20,
          top: 100,
          width: 200,
          display: { xs: 'none', lg: 'block' },
        }}
      >
        <Typography variant="h6" gutterBottom>
          内联模式示例
        </Typography>
        <CustomizedAnchor
          items={anchorItems.slice(0, 3)} // 只显示前3个项目
          offsetTop={80}
          showInkInFixed={false}
          onChange={(activeLink) => {
            console.log('内联模式当前活动锚点:', activeLink);
          }}
        />
      </Box>
    </Box>
  );
};

export default CustomizedAnchorExample;
