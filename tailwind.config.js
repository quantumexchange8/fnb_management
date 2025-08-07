import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
            },
            backgroundImage: {
                'gradient-hidden': 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 27.16%, rgba(242, 101, 34, 0.95) 418.27%)',
                'active-step': 'linear-gradient(68deg, #FCFCFC 38.84%, #A6A6A6 405.14%)',
            },
            colors: {
                primary: {
                    25: '#FFF8EE',
                    50: '#FFF3E1',
                    100: '#FEECD2',
                    200: '#FDD3A6',
                    300: '#FBB479',
                    400: '#F79557',
                    500: '#F26522',
                    600: '#D04718',
                    700: '#AE2F11',
                    800: '#8C1B0A',
                    900: '#740D06',
                },
                success: {
                    100: '#E9FCD8',
                    200: '#CEFAB1',
                    300: '#A9F088',
                    400: '#85E167',
                    500: '#52CE39',
                    600: '#36B129',
                    700: '#1E941C',
                    800: '#127718',
                    900: '#0A6217',
                },
                info: {
                    100: '#CFF2FF',
                    200: '#9FE1FF',
                    300: '#70CBFF',
                    400: '#4CB5FF',
                    500: '#1190FF',
                    600: '#0C6FDB',
                    700: '#0853B7',
                    800: '#053A93',
                    900: '#03297A',
                },
                warning: {
                    100: '#FFFBCC',
                    200: '#FFF699',
                    300: '#FFF066',
                    400: '#FFEA3F',
                    500: '#FFE100',
                    600: '#DBBE00',
                    700: '#B79D00',
                    800: '#937D00',
                    900: '#7A6500',
                },
                error: {
                    50: '#FFEEE4',
                    100: '#FEE5D6',
                    200: '#FEC5AE',
                    300: '#FD9E86',
                    400: '#FB7967',
                    500: '#F93D36',
                    600: '#D6272F',
                    700: '#B31B2F',
                    800: '#90112C',
                    900: '#770A2B',
                },
                neutral: {
                    25: '#FCFCFC',
                    50: '#F3F3F3',
                    100: '#E4E4E7',
                    200: '#D4D4D8',
                    300: '#A1A1AA',
                    400: '#71717A',
                    500: '#52525B',
                    600: '#3F3F46',
                    700: '#27272A',
                    800: '#18181B',
                    900: '#09090B',
                },
                otehrs: {
                    'purple': '#8E51FF',
                    'Pink': '#F6339A',
                    'Cyan': '#00D3F2',
                    'Teal': '#00D5BE',
                    'Lime': '#9AE600',
                },
            },
            boxShadow: {
                'input': '0px 1px 2px 0px rgba(9, 9, 11, 0.05)',
                'container': '3px 0px 7.2px 0px rgba(229, 229, 229, 0.31)',
                'sec-voucher': '0px -1px 16.9px 0px rgba(0, 0, 0, 0.05)',
                'action': '0px 1.143px 2.286px 0px rgba(9, 9, 11, 0.05)',
                'footer': '0px 2px 34.6px 0px rgba(9, 9, 11, 0.05)',
                'button': '0 -3px 0 0 rgba(93, 93, 93, 0.04) inset, 0 1px 2px 0 rgba(9, 9, 11, 0.05)',
            }
        },
        fontSize: {
            'xss': ['10px', {
                lineHeight: '16px'
            }],
            'xs': ['12px', {
                lineHeight: '16px'
            }],
            'sm': ['14px', {
                lineHeight: '20px'
            }],
            'base': ['16px', {
                lineHeight: '24px'
            }],
            'lg': ['20px', {
                lineHeight: '28px'
            }],
            'xl': ['24px', {
                lineHeight: '32px'
            }],
            'xxl': ['30px', {
                lineHeight: '42px'
            }],
        },
        screens: {
            'xl': '1280px',
            'lg': '1024px',
            'md': '768px',
            'sm': '360px',
            'xs': '320px',
        }
    },

    plugins: [forms],
};
