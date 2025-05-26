// API接口封装模块
const BASE_URL = 'http://127.0.0.1:3007';

const API = {
    // 注册用户
    register(username, password) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // 使用反引号定义字符串模板
            xhr.open('POST', `${BASE_URL}/api/reguser`);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const result = JSON.parse(xhr.responseText);
                        if (result.status === '0' || result.status === 0) {
                            resolve(result);
                        } else {
                            reject(result.message);
                        }
                    } else {
                        reject('请求失败，请稍后再试');
                    }
                }
            };
            xhr.send(`username=${username}&password=${password}`);
        });
    },

    // 用户登录
    login(username, password) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // 使用反引号定义字符串模板
            xhr.open('POST', `${BASE_URL}/api/login`);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const result = JSON.parse(xhr.responseText);
                        if (result.status === '0' || result.status === 0) {
                            // 保存token
                            Util.setToken(result.token);
                            resolve(result);
                        } else {
                            reject(result.message);
                        }
                    } else {
                        reject('请求失败，请稍后再试');
                    }
                }
            };
            xhr.send(`username=${username}&password=${password}`);
        });
    },

    // 获取用户信息
    getUserInfo() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // 使用反引号定义字符串模板
            xhr.open('GET', `${BASE_URL}/my/userinfo`);
            xhr.setRequestHeader('Authorization', Util.getToken());
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const result = JSON.parse(xhr.responseText);
                        if (result.status === '0' || result.status === 0) {
                            resolve(result.data);
                        } else {
                            reject(result.message);
                        }
                    } else if (xhr.status === 401) {
                        reject('身份认证失败，请重新登录');
                    } else {
                        reject('请求失败，请稍后再试');
                    }
                }
            };
            xhr.send();
        });
    },

    // 更新用户信息
    updateUserInfo(nickname, email) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // 使用反引号定义字符串模板
            xhr.open('POST', `${BASE_URL}/my/userinfo`);
            xhr.setRequestHeader('Authorization', Util.getToken());
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const result = JSON.parse(xhr.responseText);
                        if (result.status === '0' || result.status === 0) {
                            resolve(result);
                        } else {
                            reject(result.message);
                        }
                    } else if (xhr.status === 401) {
                        reject('身份认证失败，请重新登录');
                    } else {
                        reject('请求失败，请稍后再试');
                    }
                }
            };
            xhr.send(`nickname=${nickname}&email=${email}`);
        });
    },

    // 更新密码
    updatePassword(oldPwd, newPwd) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // 使用反引号定义字符串模板
            xhr.open('POST', `${BASE_URL}/my/updatepwd`);
            xhr.setRequestHeader('Authorization', Util.getToken());
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const result = JSON.parse(xhr.responseText);
                        if (result.status === '0' || result.status === 0) {
                            resolve(result);
                        } else {
                            reject(result.message);
                        }
                    } else if (xhr.status === 401) {
                        reject('身份认证失败，请重新登录');
                    } else {
                        reject('请求失败，请稍后再试');
                    }
                }
            };
            xhr.send(`oldPwd=${oldPwd}&newPwd=${newPwd}`);
        });
    },


    // 获取文章分类列表
    getArticleCates() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // 使用反引号定义字符串模板
            xhr.open('GET', `${BASE_URL}/my/article/cates`);
            xhr.setRequestHeader('Authorization', Util.getToken());
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const result = JSON.parse(xhr.responseText);
                        if (result.status === '0' || result.status === 0) {
                            resolve(result.data);
                        } else {
                            reject(result.message);
                        }
                    } else if (xhr.status === 401) {
                        reject('身份认证失败，请重新登录');
                    } else {
                        reject('请求失败，请稍后再试');
                    }
                }
            };
            xhr.send();
        });
    },

    // 添加文章分类
    addArticleCate(name, alias) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // 使用反引号定义字符串模板
            xhr.open('POST', `${BASE_URL}/my/article/addcates`);
            xhr.setRequestHeader('Authorization', Util.getToken());
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const result = JSON.parse(xhr.responseText);
                        if (result.status === '0' || result.status === 0) {
                            resolve(result);
                        } else {
                            reject(result.message);
                        }
                    } else if (xhr.status === 401) {
                        reject('身份认证失败，请重新登录');
                    } else {
                        reject('请求失败，请稍后再试');
                    }
                }
            };
            xhr.send(`name=${name}&alias=${alias}`);
        });
    },

    // 删除文章分类
    deleteArticleCate(id) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // 使用反引号定义字符串模板
            xhr.open('GET', `${BASE_URL}/my/article/deletecate/${id}`);
            xhr.setRequestHeader('Authorization', Util.getToken());
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const result = JSON.parse(xhr.responseText);
                        if (result.status === '0' || result.status === 0) {
                            resolve(result);
                        } else {
                            reject(result.message);
                        }
                    } else if (xhr.status === 401) {
                        reject('身份认证失败，请重新登录');
                    } else {
                        reject('请求失败，请稍后再试');
                    }
                }
            };
            xhr.send();
        });
    },

    // 获取单个文章分类
    getArticleCateById(id) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // 使用反引号定义字符串模板
            xhr.open('GET', `${BASE_URL}/my/article/cates/${id}`);
            xhr.setRequestHeader('Authorization', Util.getToken());
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const result = JSON.parse(xhr.responseText);
                        if (result.status === '0' || result.status === 0) {
                            resolve(result.data);
                        } else {
                            reject(result.message);
                        }
                    } else if (xhr.status === 401) {
                        reject('身份认证失败，请重新登录');
                    } else {
                        reject('请求失败，请稍后再试');
                    }
                }
            };
            xhr.send();
        });
    },

    // 更新文章分类
    updateArticleCate(id, name, alias) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // 使用反引号定义字符串模板
            xhr.open('POST', `${BASE_URL}/my/article/updatecate`);
            xhr.setRequestHeader('Authorization', Util.getToken());
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const result = JSON.parse(xhr.responseText);
                        if (result.status === '0' || result.status === 0) {
                            resolve(result);
                        } else {
                            reject(result.message);
                        }
                    } else if (xhr.status === 401) {
                        reject('身份认证失败，请重新登录');
                    } else {
                        reject('请求失败，请稍后再试');
                    }
                }
            };
            xhr.send(`Id=${id}&name=${name}&alias=${alias}`);
        });
    }
};