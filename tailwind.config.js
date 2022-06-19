function pxToRem(val, unit = 'px') { // 此处并未做处理（依然使用的px为单位，如果需要rem等可自由扩展）
    return `${val}${unit}`
}

const unitValues = {
    0.5: pxToRem(0.5),
    1.5: pxToRem(1.5),
    2.5: pxToRem(2.5),
    3.5: pxToRem(3.5),
};
for (let i = 1; i <= 96; i++) {
    unitValues[i] = pxToRem(i)
}
module.exports = {
    prefix: 'tw-',
    content: [
        './index.html',
        './src/**/*.{vue,less,css,html}',
    ],
    // darkMode: 'media', // or 'media' or 'class'
    theme: {
        spacing: unitValues,
        extend: {
            colors: {
                dark: "#27292B", // 默认的深黑色字体颜色
                light: "#858C96", // 默认的浅黑色字体颜色
            },
            fontSize: {
                ...unitValues,
            },
            borderRadius: {
                ...unitValues,
            },
            lineHeight: {
                ...unitValues,
            },
            width: {
                0: '0px',
            },
            fontWeight: {
                100: '100',
                200: '200',
                300: '300',
                400: '400',
                500: '500',
                600: '600',
                700: '700',
                800: '800',
                900: '900',
            },
        },
    },
    plugins: [],
}
