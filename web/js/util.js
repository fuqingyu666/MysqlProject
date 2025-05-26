// 工具函数模块
const Util = {
    // 存储本地token
    setToken(token) {
        localStorage.setItem('token', token);
    },

    // 获取本地token
    getToken() {
        return localStorage.getItem('token');
    },

    // 移除本地token
    removeToken() {
        localStorage.removeItem('token');
    },

    // 检查是否已登录
    isLoggedIn() {
        return !!this.getToken();
    },

    // 显示提示信息
    showTip(tipElement, message, isError = true) {
        tipElement.textContent = message;
        tipElement.className = isError ? 'form-tip' : 'form-tip success';
        // 3秒后清除提示
        setTimeout(() => {
            tipElement.textContent = '';
        }, 3000);
    },

    // 重定向到指定页面
    redirectTo(page) {
        window.location.href = page;
    },


};



