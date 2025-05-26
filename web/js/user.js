// 用户相关逻辑模块
const User = {
    initLoginPage() {
        // 切换登录/注册标签
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const tab = this.getAttribute('data-tab');
                document.querySelectorAll('.form-group').forEach(form => {
                    form.classList.add('hidden');
                    form.classList.remove('active');
                });
                document.querySelector(`.${tab}-form`).classList.remove('hidden');
                document.querySelector(`.${tab}-form`).classList.add('active');
            });
        });

        // 登录按钮点击事件
        document.getElementById('login-btn').addEventListener('click', () => {
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value.trim();

            if (!username || !password) {
                Util.showTip(document.getElementById('login-tip'), '请输入用户名和密码');
                return;
            }

            console.log('开始登录请求...'); // 添加日志输出

            API.login(username, password)
                .then(result => {
                    console.log('登录成功:', result); // 添加日志输出
                    Util.showTip(document.getElementById('login-tip'), '登录成功', false);

                    // 保存登录状态
                    localStorage.setItem('isLoggedIn', 'true');

                    // 3秒后跳转到用户中心
                    setTimeout(() => {
                        console.log('准备跳转到用户中心...'); // 添加日志输出
                        Util.redirectTo('user.html');
                    }, 1000);
                })
                .catch(error => {
                    console.error('登录失败:', error); // 添加错误日志
                    Util.showTip(document.getElementById('login-tip'), error);
                });
        });

        // 注册按钮点击事件
        document.getElementById('register-btn').addEventListener('click', () => {
            const username = document.getElementById('register-username').value.trim();
            const password = document.getElementById('register-password').value.trim();

            if (!username || !password) {
                Util.showTip(document.getElementById('register-tip'), '请输入用户名和密码');
                return;
            }

            if (password.length < 6 || password.length > 12) {
                Util.showTip(document.getElementById('register-tip'), '密码长度应为6-12位');
                return;
            }

            API.register(username, password)
                .then(result => {
                    Util.showTip(document.getElementById('register-tip'), '注册成功，请登录', false);
                    // 切换到登录标签
                    document.querySelector('.tab-btn.active').click();
                })
                .catch(error => {
                    Util.showTip(document.getElementById('register-tip'), error);
                });
        });
    },

    initUserPage() {
        // 检查是否已登录
        if (!Util.isLoggedIn()) {
            alert('请先登录');
            Util.redirectTo('index.html');
            return;
        }

        // 退出登录
        document.getElementById('logout-btn').addEventListener('click', () => {
            Util.removeToken();
            localStorage.removeItem('isLoggedIn');
            Util.redirectTo('index.html');
        });

        // 文章分类管理按钮
        const artCateBtn = document.getElementById('artcate-btn');
        if (artCateBtn) {
            artCateBtn.addEventListener('click', () => {
                Util.redirectTo('artcate.html');
            });
        } else {
            console.error('未找到文章分类按钮元素');
        }

        // 返回用户中心 - 修改这里，增加元素存在性检查
        const backBtn = document.getElementById('back-to-user-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                Util.redirectTo('user.html');
            });
        } else {
            console.error('未找到返回用户中心按钮元素');
        }

        // 获取用户信息并显示
        this.fetchUserInfo();

      
      

        // 保存用户信息
        document.getElementById('save-userinfo-btn').addEventListener('click', () => {
            const nickname = document.getElementById('edit-nickname').value.trim();
            const email = document.getElementById('edit-email').value.trim();

            if (!nickname || !email) {
                Util.showTip(document.getElementById('userinfo-tip'), '请填写完整信息');
                return;
            }

            API.updateUserInfo(nickname, email)
                .then(result => {
                    Util.showTip(document.getElementById('userinfo-tip'), '更新成功', false);
                    document.querySelector('.userinfo-form').classList.add('hidden');
                    this.fetchUserInfo();
                })
                .catch(error => {
                    Util.showTip(document.getElementById('userinfo-tip'), error);
                });
        });

    
    },

    // 获取用户信息并显示
    fetchUserInfo() {
        console.log('开始获取用户信息...');
        API.getUserInfo()
            .then(userInfo => {
                console.log('获取用户信息成功:', userInfo);
                // 确保DOM元素存在后再操作
                const usernameEl = document.getElementById('user-username');
                const nicknameEl = document.getElementById('user-nickname');
                const emailEl = document.getElementById('user-email');

                if (usernameEl) usernameEl.textContent = userInfo.username || '-';
                if (nicknameEl) nicknameEl.textContent = userInfo.nickname || '-';
                if (emailEl) emailEl.textContent = userInfo.email || '-';
            })
            .catch(error => {
                console.error('获取用户信息失败:', error);
                alert(error);
                if (error.includes('身份认证失败') || error.includes('Unauthorized')) {
                    Util.removeToken();
                    localStorage.removeItem('isLoggedIn');
                    Util.redirectTo('index.html');
                }
            });
    }
};
    