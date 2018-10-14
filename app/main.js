/**
 * Mohu APP
 * 膜乎免`番羽土啬`APP
 * 
 * @author Xmader
 * @copyright Copyright (c) 2018 Xmader
 * 
 * Source Code: https://github.com/Xmader/mohu
 */

const path = require("path")
const { app, BrowserWindow, ipcMain, Menu, shell, dialog } = require("electron")

const localProxy = require("./src/local_proxy")
const check_update = require("./src/check_update")
const copy_current_url = require("./src/copy_current_url")

const isDev = process.argv.pop() == "dev"

let mainWindow = null, landingWindow = null

app.on("ready", () => {
    localProxy.run((error, proxyAddress) => {
        if (error) {
            dialog.showMessageBox({
                type: "error",
                buttons: ["确定"],
                defaultId: 0,
                title: "错误",
                message: `${error}`
            })
            app.exit(1)
        } else {
            createWindow(proxyAddress)
        }
    })
})

const open_clock_win = (t) => {
    clock_win = new BrowserWindow({
        // frame: false,
        title: t == "violent" ? "暴力续命" : "续命时钟",
        icon: path.join(__dirname, "assets", 'logo.png'),
        width: 600,
        height: t == "violent" ? 120 : 150,
        resizable: false,
        maximizable: false,
        alwaysOnTop: true,
        useContentSize: true
    })
    clock_win.setMenu(null)
    clock_win.loadURL(t == "violent" ? `file://${__dirname}/pages/clock/clock.html?violent=true` : `file://${__dirname}/pages/clock/clock.html`)

}

const open_manual = (ty) => {
    var manual_win = new BrowserWindow({
        width: 1100,
        height: 740,
        icon: path.join(__dirname, "assets", ty == "mogicians" ? 'mogicians_manual.png' : "rubao_manual.jpg"),
        title: `${ty == "mogicians" ? "膜法" : "乳包"}指南`,
        webPreferences: {
            // webSecurity: false,  // 禁用同源策略
        }
    })
    manual_win.setMenu(null)
    manual_win.loadURL(ty == "mogicians" ? "https://xmader.github.io/mogicians_manual/" : "https://xmader.github.io/rubao_manual/")

}

const template = [
    {
        label: "页面",

        submenu: [
            {
                label: "转到上一页",
                id: "goBack",
                accelerator: "Ctrl+Left",
                enabled: false,
                click: () => {
                    mainWindow.webContents.goBack();

                }
            },
            {
                label: "转到下一页",
                id: "goForward",
                accelerator: "Ctrl+Right",
                enabled: false,
                click: () => {
                    mainWindow.webContents.goForward()

                }
            },
            {
                label: "刷新",

                accelerator: "F5",
                // accelerator: "Ctrl+R",
                click: () => {
                    mainWindow.webContents.reload();
                }
            },
            // {
            //     label: "搜索",

            //     //accelerator: "F5",
            //     click: () => {
            //         mainWindow.webContents.findInPage("1");
            //     }
            // },
            { type: 'separator' },//分割线
            {
                label: "放大页面",
                role: "zoomin",
                accelerator: "Ctrl+=",
            },
            {
                label: "重置缩放级别",
                role: "resetzoom"
            },
            // {
            //     label: "当前缩放级别: ",
            //     id: "zoomlevel",
            //     enabled: false,
            // },
            {
                label: "缩小页面",
                role: "zoomout"
            },
        ]
    },
    {
        label: "进入",

        submenu: [
            {
                label: "膜乎",

                // accelerator: "Ctrl+M",
                click: () => {
                    mainWindow.webContents.loadURL("https://www.mohu.club/")
                }
            },
            {
                label: "辱乎",
                click: () => { mainWindow.webContents.loadURL("https://www.ruhu.ml/") }
            },
            {
                label: "品葱",
                click: () => { mainWindow.webContents.loadURL("https://www.pin-cong.com/") }
            },
            {
                label: "中文维基百科",
                click: () => { mainWindow.webContents.loadURL("https://zh.wikipedia.org/") }
            },
            {
                label: "端点星计划 (备份微信、微博等平台被删文章)",
                click: () => { mainWindow.webContents.loadURL("https://terminus2049.github.io/") }
            },
            {
                label: "续命",
                submenu: [
                    {
                        label: "续命时钟",
                        click: () => { open_clock_win() }
                    },
                    {
                        label: "暴力续命",
                        click: () => { open_clock_win("violent") }
                    },
                ]
            },
            {
                label: "膜法指南",
                click: () => { open_manual("mogicians") }
            },
            {
                label: "乳包指南",
                click: () => { open_manual("rubao") }
            },
            {
                label: "小游戏",

                submenu: [
                    {
                        label: "Flappy Winnie",

                        click: () => {
                            mainWindow.webContents.loadURL(`file://${__dirname}/pages/flappy_winnie/index.html`)
                        }
                    },
                    {
                        label: "切包子",

                        click: () => {
                            mainWindow.webContents.loadURL(`file://${__dirname}/pages/bao/index.html`)
                        }
                    },
                    {
                        label: "Flappy Frog",

                        click: () => {
                            mainWindow.webContents.loadURL(`file://${__dirname}/pages/flappy_frog/index.html`)
                        }
                    },
                ]
            }]
    },
    {
        label: "续命时钟",
        click: () => { open_clock_win() }
    },
    {
        label: "膜法指南",
        click: () => { open_manual("mogicians") }
    },
    {
        label: "乳包指南",
        click: () => { open_manual("rubao") }
    },
    {
        label: '视图',
        submenu: [
            {
                label: "全屏",
                accelerator: "F11",
                click: () => {
                    mainWindow.setFullScreen(!mainWindow.isFullScreen());
                }
            },
            // { type: 'separator' },//分割线
            {
                label: '切换开发者工具',
                accelerator: "F12",
                click() { BrowserWindow.getFocusedWindow().webContents.toggleDevTools(); }
            },
        ]
    },
    {
        label: '分享',

        submenu: [
            {
                label: "复制当前网址",
                click: () => {
                    copy_current_url()
                }
            },

        ]
    },
    {
        label: '高级',
        submenu: [
            {
                label: '检查更新',
                click() { manual_check_update() }
            },
            {
                label: '关于',
                click() { shell.openExternal("https://github.com/Xmader/mohu") }
            },
        ]
    },

]
const menu = Menu.buildFromTemplate(template)
const refresh_menu = () => {
    menu.getMenuItemById("goBack").enabled = mainWindow.webContents.canGoBack()
    menu.getMenuItemById("goForward").enabled = mainWindow.webContents.canGoForward()
    contextMenu.getMenuItemById("context_goBack").enabled = mainWindow.webContents.canGoBack()
    contextMenu.getMenuItemById("context_goForward").enabled = mainWindow.webContents.canGoForward()

}

//给文本框增加右键菜单
const contextMenuTemplate = [
    {
        label: "转到上一页",
        id: "context_goBack",
        enabled: false,
        click: () => {
            mainWindow.webContents.goBack();

        }
    },
    {
        label: "转到下一页",
        id: "context_goForward",
        enabled: false,
        click: () => {
            mainWindow.webContents.goForward()

        }
    },
    { type: 'separator' }, //分隔线 
    { label: "剪切", role: 'cut' }, //Cut菜单项 
    { label: "复制", role: 'copy' }, //Copy菜单项 
    { label: "粘贴", role: 'paste' }, //Paste菜单项 
    { label: "删除", role: 'delete' }, //Delete菜单项 
    { type: 'separator' }, //分隔线 
    { label: "全选", role: 'selectall' } //Select All菜单项 
];
const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);


function createWindow(proxyAddress) {
    locale = app.getLocale();
    landingWindow = new BrowserWindow({
        show: false,
        frame: isDev,
        title: "膜乎APP",
        icon: path.join(__dirname, "assets", 'logo.png'),
        width: 490,
        height: 400
    })



    landingWindow.once("show", () => {
        // Create the browser window.
        mainWindow = new BrowserWindow({
            width: 1100,
            height: 740,
            icon: path.join(__dirname, "assets", 'logo.png'),
            title: "膜乎APP",
            show: false,
            webPreferences: {
                nodeIntegration: false, // 不集成 Nodejs
                // webSecurity: false,//禁用同源策略
                // allowRunningInsecureContent:true,//允许一个 https 页面运行 http url 里的资源
                preload: path.join(__dirname, 'pre.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
            }
        })

        mainWindow.once("show", () => {
            landingWindow.hide()
            landingWindow.close()
            landingWindow.removeAllListeners();
            mainWindow.show()
            landingWindow = null
            check_update()
        })

        mainWindow.webContents.once('did-finish-load', () => {
            if (!mainWindow) {
                throw new Error('"mainWindow" is not defined');
            }
            mainWindow.show();
            mainWindow.focus();
        });

        mainWindow.webContents.on('did-navigate', () => {
            refresh_menu()

        });

        mainWindow.webContents.on('new-window', (event, url) => {
            event.preventDefault()
            mainWindow.webContents.loadURL(url)
        })

        mainWindow.on('closed', function (event) {
            mainWindow.removeAllListeners();
            mainWindow = null;

            if (process.platform === "darwin") {
                app.exit(0);
            }
        })

        mainWindow.webContents.session.setProxy({
            proxyRules: 'socks5://' + proxyAddress
        }, function () {
            mainWindow.loadURL('https://www.mohu.club/');
        });

        Menu.setApplicationMenu(menu)
    })

    landingWindow.loadURL(`file://${__dirname}/pages/landing.html`)
    landingWindow.once('ready-to-show', () => {
        landingWindow.show()
    })
}

app.on("window-all-closed", () => {
    app.quit()
})

app.on("quit", () => {
    app.exit(0)
})

ipcMain.on("reload", () => {
    mainWindow.webContents.reloadIgnoringCache()
})

ipcMain.on("right_btn", () => {
    refresh_menu()
    contextMenu.popup(mainWindow);
})