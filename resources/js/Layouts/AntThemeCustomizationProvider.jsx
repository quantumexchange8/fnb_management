import React from "react";
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';

function AntThemeCustomizationProvider({ children }) {
    return (
        <ConfigProvider
            theme={{
                cssVar: true,
                hashed: false,
                token: {
                    colorPrimary: '#F26522', // primary color gray-950
                    borderRadius: 2,
                    fontFamily: 'DM Sans, sans-serif',
                },
                components: {
                    Select: {
                        controlHeight: '46px',
                        padding: '8px 16px',
                        controlPaddingHorizontal: 16, // 水平内边距
                        paddingContentHorizontal: 16, // 内容水平内边距
                        fontSize: '14px',
                        lineHeight: '20px',
                        fontFamily: 'DM Sans, sans-serif',
                        optionFontSize: '14px',
                        optionLineHeight: '20px',
                        optionPadding: '8px 16px',
                        optionSelectedFontWeight: '400',
                        selectorBg: '#FFF', // Tailwind gray-100
                        multipleItemHeight: '20px',
                        activeOutlineColor: 'rgb(0 0 0 / 0%)',
                        optionHeight: '36px',
                        hoverBorderColor: '#09090B',
                    },
                    InputNumber: {
                        hoverBorderColor: '#09090B',
                    }
                }
            }}
        >
            <StyleProvider hashPriority='high'>{children}</StyleProvider>
        </ConfigProvider>
    )
}

export default AntThemeCustomizationProvider;