/* 第9章 客户端检测 */
// 9.1 能力检测
/*
 * if (某个属性、方法) {
 *     使用这个属性、方法
 * }
 */
// 两个原则
// 1. 先检测通用特性，再检测个别特性
function getElement(id) {
    if (document.getElementById) {
        return document.getElementById(id);
    } else if (document.all) {
        return document.all[id];
    } else {
        throw new Error('Error');
    }
}

// 2. 检测实际要用到的，一个特性存在，不代表另一个特性存在
// bad：
function getWindowWidth() {
    // 假设是IE
    if (document.all) {
        // 其它浏览器可能也有该属性
        return document.documentElement.clientWidth;
    }
    return window.innerWidth;
}

// 9.1.1 更可靠的能力检测
// 不仅检测特性是否存在，更检测是否具有相应功能
// bad：只检测了是否存在
function isSortalbe(obj) {
    return !!obj.sort;
}
// 假设这样一个对象：有 sort 属性，但根本没有相应功能
console.log(isSortalbe({ sort: true }));
// good：
function isSortalbev2(obj) {
    return typeof obj.sort == 'function';
}
console.log(isSortalbev2({ sort: true }));

// 9.1.2 能力检测，不是浏览器检测
// bad：
var isFirefox = !!(navigator.vendor && navigator.vendorSub);
var isIE = !!(document.all && document.uniqueID);
// good:
// 确定浏览器是否支持Netscape风格的插件
var hasNSPlugins = !!(navigator.plugins && navigator.plugins.length);
// 确定浏览器是否具有 DOM1级 规定的能力
var hasDOM1 = !!(document.getElementById && document.createElement && document.getElementsByTagName);

// 9.2 怪癖(quirks)检测：检测浏览器是否存在特定bug
var hasDontEnumQuirk = function () {
    var obj = { toString: function () {} };
    for (let prop in obj) {
        if (prop == 'toString') {
            return false;
        }
    }
    return true;
};
console.log(hasDontEnumQuirk());

var hasEnumShadowsQuirk = function () {
    var obj = { toString: function () {} };
    var count = 0;
    for (let prop in obj) {
        if (prop == 'toString') {
            ++count;
        }
    }
    return count > 1;
};
console.log(hasEnumShadowsQuirk());

// 9.3 用户代理检测
// 查看浏览器的用户代理字符串
console.log(navigator.userAgent);

// 9.3.2 用户代理字符串检测技术
var client = (function () {
    // 呈现引擎
    var engine = {
        ie: 0,
        gecko: 0,
        webkit: 0,
        khtml: 0,
        opera: 0,
        ver: null,
    };

    // 浏览器
    var browser = {
        ie: 0,
        firefox: 0,
        safari: 0,
        konq: 0,
        opera: 0,
        chrome: 0,
        ver: null,
    };

    // 平台
    var system = {
        // 桌面端
        win: false,
        mac: false,
        xll: false,

        // 移动端
        iphone: false,
        ipod: false,
        ipad: false,
        ios: false,
        android: false,
        nokiaN: false,
        winMobile: false,

        // 游戏平台
        wii: false,
        ps: false,
    };

    // 呈现引擎及浏览器检测
    var ua = navigator.userAgent;
    if (window.opera) {
        engine.ver = browser.ver = window.opera.version();
        engine.opera = browser.opera = parseFloat(engine.ver);
    } else if (/AppleWebKit\/(\S+)/.test(ua)) {
        engine.ver = RegExp['$1'];
        engine.webkit = parseFloat(engine.ver);

        if (/Chrome\/(\S+)/.test(ua)) {
            browser.ver = RegExp['$1'];
            browser.chrome = parseFloat(browser.ver);
        } else if (/Version\/(\S+)/.test(ua)) {
            browser.ver = RegExp['$1'];
            browser.safari = parseFloat(browser.ver);
        } else {
            let safariVer = 1;
            if (engine.webkit < 100) {
                safariVer = 1;
            } else if (engine.webkit < 312) {
                safariVer = 1.2;
            } else if (engine.webkit < 412) {
                safariVer = 1.3;
            } else {
                safariVer = 2;
            }
            browser.safari = browser.ver = safariVer;
        }
    } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
        engine.ver = browser.ver = RegExp['$1'];
        engine.khtml = browser.konq = parseFloat(engine.ver);
    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
        engine.ver = RegExp['$1'];
        engine.gecko = parseFloat(engine.ver);

        if (/Firefox\/(\S+)/.test(ua)) {
            browser.ver = RegExp['$1'];
            browser.firefox = parseFloat(browser.ver);
        }
    } else if (/MSIE ([^;]+)/.test(ua)) {
        engine.ver = browser.ver = RegExp['$1'];
        engine.ie = browser.ie = parseFloat(engine.ver);
    }

    // 桌面端检测
    var p = navigator.platform;
    system.win = p.indexOf('Win') == 0;
    system.mac = p.indexOf('Mac') == 0;
    system.xll = p.indexOf('Xll') == 0 || p.indexOf('linux') == 0;

    // Windows平台版本号
    if (system.win) {
        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
            if (RegExp['$1'] == 'NT') {
                switch (RegExp['$2']) {
                    case '5.0':
                        system.win = '2000';
                        breeak;
                    case '5.1':
                        system.win = 'XP';
                        break;
                    case '6.0':
                        system.win = 'Vista';
                        break;
                    case '6.1':
                        system.win = '7';
                        break;
                    case '6.2':
                        system.win = '8';
                        break;
                    case '6.3':
                        system.win = '8.1';
                        break;
                    case '6.4':
                    case '10':
                        system.win = '10';
                        break;
                    default:
                        system.win = 'NT';
                        break;
                }
            } else if (RegExp['$1'] == '9x') {
                system.win = 'ME';
            } else {
                system.win = RegExp['$1'];
            }
        }
    }

    // 移动端
    system.iphone = ua.indexOf('iPhone') > -1;
    system.ipod = ua.indexOf('iPod') > -1;
    system.ipad = ua.indexOf('iPad') > -1;
    system.nokiaN = ua.indexOf('NokiaN') > -1;

    if (system.mac && ua.indexOf('Mobile') > -1) {
        if (/CPU (?:iphone )?OS (\d+_\d+)/.test(ua)) {
            system.ios = parseFloat(RegExp.$1.replace('_', '.'));
        } else {
            system.ios = 2;
        }
    }

    if (/Android (\d+\.\d+)/.test(ua)) {
        system.android = parseFloat(RegExp.$1);
    }

    if (system.win == 'CE') {
        system.winMobile = system.win;
    } else if (system.win == 'Ph') {
        if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
            system.win = 'Phone';
            system.winMobile = parseFloat(RegExp['$1']);
        }
    }

    system.wii = ua.indexOf('Wii') > -1;
    system.ps = /playstation/i.test(ua);

    return {
        engine,
        browser,
        system,
    };
})();
console.log(client);
