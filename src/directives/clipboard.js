import Clipboard from "clipboard"

const DefaultConfig = {
    autoSetContainer: true,
    appendToBody: true, // This fixes IE, see #50
    success: _ => _,
    error: _ => _,
}

export default {
    install(Vue, VueClipboardConfig = {}) {
        VueClipboardConfig = Object.assign({}, DefaultConfig, VueClipboardConfig)
        const globalPrototype = Vue.version.slice(0, 2) === '3.' ? Vue.config.globalProperties : Vue.prototype
        globalPrototype.$clipboardConfig = VueClipboardConfig
        globalPrototype.$copyText = function (text, container) {
            return new Promise(function (resolve, reject) {
                const fakeElement = document.createElement('button')
                const clipboard = new Clipboard(fakeElement, {
                    text: function () {
                        return text
                    },
                    action: function () {
                        return 'copy'
                    },
                    container: typeof container === 'object' ? container : document.body
                })
                clipboard.on('success', function (e) {
                    clipboard.destroy()
                    globalPrototype.$clipboardConfig.success(e);
                    resolve(e)
                })
                clipboard.on('error', function (e) {
                    clipboard.destroy()
                    globalPrototype.$clipboardConfig.error(e);
                    reject(e)
                })
                if (VueClipboardConfig.appendToBody) document.body.appendChild(fakeElement)
                fakeElement.click()
                if (VueClipboardConfig.appendToBody) document.body.removeChild(fakeElement)
            })
        }
        Vue.directive('copy', {
            mounted(el, binding, vnode) {
                if (binding.arg === 'success') {
                    el._vClipboard_success = binding.value
                } else if (binding.arg === 'error') {
                    el._vClipboard_error = binding.value
                } else {
                    const clipboard = new Clipboard(el, {
                        text: function () {
                            return binding.value || "";
                        },
                        action: function () {
                            return binding.arg === 'cut' ? 'cut' : 'copy'
                        },
                        container: VueClipboardConfig.autoSetContainer ? el : undefined
                    });

                    clipboard.on('success', function (e) {
                        if (!e.text || e.text.trim().length === 0) {
                            return
                        }
                        const callback = el._vClipboard_success
                        if (callback) {
                            callback(e)
                        } else {
                            globalPrototype.$clipboardConfig.success(e);
                        }
                    })
                    clipboard.on('error', function (e) {
                        const callback = el._vClipboard_error
                        if (callback) {
                            callback(e)
                        } else {
                            globalPrototype.$clipboardConfig.error(e);
                        }
                    })
                    el._vClipboard = clipboard
                }
            },
            updated(el, binding) {
                if (binding.arg === 'success') {
                    el._vClipboard_success = binding.value
                } else if (binding.arg === 'error') {
                    el._vClipboard_error = binding.value
                } else {
                    el._vClipboard.text = function () {
                        return binding.value
                    }
                    el._vClipboard.action = function () {
                        return binding.arg === 'cut' ? 'cut' : 'copy'
                    }
                }
            },
            unmounted(el, binding) {
                // FIXME: investigate why $element._vClipboard was missing
                if (!el._vClipboard) return
                if (binding.arg === 'success') {
                    delete el._vClipboard_success
                } else if (binding.arg === 'error') {
                    delete el._vClipboard_error
                } else {
                    el._vClipboard.destroy()
                    delete el._vClipboard
                }
            }
        })
    },
    config: DefaultConfig,
}
