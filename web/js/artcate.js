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

                cates.forEach(cate => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${cate.Id}</td>
                        <td>${cate.name}</td>
                        <td>${cate.alias}</td>
                        <td>
                            <button class="action-btn edit-btn" data-id="${cate.Id}">编辑</button>
                            <button class="action-btn delete-btn" data-id="${cate.Id}">删除</button>
                        </td>
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
                } else {
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