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
                    localStorage.setItem('userId', result.id);   //新加的

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

// 文章分类相关逻辑模块
const ArtCate = {
    initArtCatePage() {
        // 检查是否已登录
        if (!Util.isLoggedIn()) {
            alert('请先登录');
            Util.redirectTo('index.html');
            return;
        }

        document.getElementById('back-btn').addEventListener('click', () => {
            Util.redirectTo('user.html');
        });

        // 添加分类按钮
        document.getElementById('add-cate-btn').addEventListener('click', () => {
            this.showCateForm('添加文章分类', null);
        });

        // 取消按钮
        document.getElementById('cancel-cate-btn').addEventListener('click', () => {
            document.querySelector('.cate-form').classList.add('hidden');
        });

        // 保存分类按钮
        document.getElementById('save-cate-btn').addEventListener('click', () => {
            const id = document.getElementById('edit-cate-id').value;
            const name = document.getElementById('cate-name').value.trim();
            const alias = document.getElementById('cate-alias').value.trim();

            if (!name || !alias) {
                Util.showTip(document.getElementById('cate-tip'), '请填写分类名称和别名');
                return;
            }

            if (id) {
                // 更新分类 - 确保ID转换为数字
                this.updateCate(parseInt(id), name, alias);
            } else {
                // 添加分类
                this.addCate(name, alias);
            }
        });

        // 加载分类列表
        this.loadCateList();
    },

    addCate(name, alias) {
        API.addArticleCate(name, alias)
            .then(result => {
                console.log('分类添加成功:', result);
                Util.showTip(document.getElementById('cate-tip'), '分类添加成功', false);
                document.querySelector('.cate-form').classList.add('hidden');
                this.loadCateList();
            })
            .catch(error => {
                console.error('分类添加失败:', error);
                Util.showTip(document.getElementById('cate-tip'), error);
            });
    },




    // 加载分类列表
    loadCateList() {
        console.log('获取文章分类列表...');
        console.log('当前token:', Util.getToken());

        API.getArticleCates()
            .then(cates => {
                const tableBody = document.getElementById('cate-table-body');
                tableBody.innerHTML = '';

                if (cates.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="4">暂无分类数据</td></tr>';
                    return;
                }




                // cates.forEach(cate => {
                //     const row = document.createElement('tr');
                //     row.innerHTML = `
                //         <td>${cate.Id}</td>
                //         <td>${cate.name}</td>
                //         <td>${cate.alias}</td>
                //         <td>
                //             <button class="action-btn edit-btn" data-id="${cate.Id}">编辑</button>

                //             <button class="action-btn delete-btn" data-id="${cate.Id}">删除</button>
                //         </td>
                //     `;
                //     tableBody.appendChild(row);
                // });




                const currentUserId = Util.getUserId(); // 获取当前用户ID
                const canEdit = currentUserId !== '5'; // 用户ID为5时不允许编辑



                cates.forEach(cate => {
                    const row = document.createElement('tr');

                    // 动态生成操作列：根据用户ID判断是否显示编辑按钮
                    let actionButtons = `
                        <button class="action-btn delete-btn" data-id="${cate.Id}">删除</button>
                    `;

                    if (canEdit) {
                        actionButtons = `
                            <button class="action-btn edit-btn" data-id="${cate.Id}">编辑</button>
                            <button class="action-btn delete-btn" data-id="${cate.Id}">删除</button>
                        `;
                    }

                    row.innerHTML = `
                        <td>${cate.Id}</td>
                        <td>${cate.name}</td>
                        <td>${cate.alias}</td>
                        <td>${actionButtons}</td>
                    `;
                    tableBody.appendChild(row);
                });


                // 绑定编辑和删除按钮事件
                this.bindCateActions();
            })
            .catch(error => {
                console.error('获取分类失败:', error);
                Util.showTip(document.getElementById('cate-tip'), error);
            });
    },

    // 绑定分类操作事件 - 强化事件委托和ID获取
    bindCateActions() {
        const tableBody = document.getElementById('cate-table-body');

        // 编辑按钮事件
        tableBody.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-btn');
            if (editBtn) {
                const id = editBtn.getAttribute('data-id');
                console.log('编辑分类ID:', id, '类型:', typeof id);

                // 双重验证：确保ID存在且可转换为数字
                if (id && !isNaN(parseInt(id))) {
                    this.getCateById(parseInt(id));
                }
                else {
                    Util.showTip(document.getElementById('cate-tip'), '无效的分类ID');
                }
            }
        });

        // 删除按钮事件
        tableBody.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.delete-btn');
            if (deleteBtn) {
                const id = deleteBtn.getAttribute('data-id');
                console.log('删除分类ID:', id, '类型:', typeof id);

                // 双重验证：确保ID存在且可转换为数字
                if (id && !isNaN(parseInt(id))) {
                    if (confirm('确定要删除该分类吗？')) {
                        this.deleteCate(parseInt(id));
                    }
                } else {
                    Util.showTip(document.getElementById('cate-tip'), '无效的分类ID');
                }
            }
        });
    },

    // 显示分类表单
    showCateForm(title, cate = null) {
        const form = document.querySelector('.cate-form');
        if (form) {
            form.classList.remove('hidden');
            document.getElementById('form-title').textContent = title;

            if (cate) {
                document.getElementById('edit-cate-id').value = cate.Id;
                document.getElementById('cate-name').value = cate.name;
                document.getElementById('cate-alias').value = cate.alias;
            } else {
                document.getElementById('edit-cate-id').value = '';
                document.getElementById('cate-name').value = '';
                document.getElementById('cate-alias').value = '';
            }
        }
    },

    // 获取分类详情 - 强化ID验证
    getCateById(id) {
        console.log('获取分类详情ID:', id, '类型:', typeof id);

        // 三重验证：确保ID是有效数字
        if (typeof id !== 'number' || isNaN(id) || id <= 0) {
            console.error('无效的分类ID:', id);
            Util.showTip(document.getElementById('cate-tip'), '分类ID必须是正整数');
            return;
        }

        API.getArticleCateById(id)
            .then(cate => {
                console.log('获取分类成功:', cate);
                this.showCateForm('编辑文章分类', cate);
            })
            .catch(error => {
                console.error('获取分类失败:', error);
                Util.showTip(document.getElementById('cate-tip'), error);
            });
    },

    // 更新分类 - 强化ID验证
    updateCate(id, name, alias) {
        console.log('更新分类ID:', id, '类型:', typeof id);

        // 三重验证：确保ID是有效数字
        if (typeof id !== 'number' || isNaN(id) || id <= 0) {
            Util.showTip(document.getElementById('cate-tip'), '分类ID必须是正整数');
            return;
        }

        API.updateArticleCate(id, name, alias)
            .then(result => {
                console.log('分类更新成功:', result);
                Util.showTip(document.getElementById('cate-tip'), '分类更新成功', false);
                document.querySelector('.cate-form').classList.add('hidden');
                this.loadCateList();
            })
            .catch(error => {
                console.error('分类更新失败:', error);
                Util.showTip(document.getElementById('cate-tip'), error);
            });
    },

    // 删除分类 - 强化ID验证
    deleteCate(id) {
        console.log('删除分类ID:', id, '类型:', typeof id);

        // 三重验证：确保ID是有效数字
        if (typeof id !== 'number' || isNaN(id) || id <= 0) {
            Util.showTip(document.getElementById('cate-tip'), '分类ID必须是正整数');
            return;
        }

        API.deleteArticleCate(id)
            .then(result => {
                console.log('分类删除成功:', result);
                Util.showTip(document.getElementById('cate-tip'), '分类删除成功', false);
                this.loadCateList();
            })
            .catch(error => {
                console.error('分类删除失败:', error);
                Util.showTip(document.getElementById('cate-tip'), error);
            });
    }
};