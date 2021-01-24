<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div style="margin-top: 15px">
        <el-input
          placeholder="请输入用户名"
          v-model="paging.query"
          class="input-with-select"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchUser"
          ></el-button>
        </el-input>
        <el-button type="primary" @click="addUserPopout">添 加</el-button>
      </div>
      <!-- 用户列表表格 -->
      <el-table :data="usersData" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="altUserState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="altUserPopout(scope.row)"
              size="mini"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              circle
              @click="altUserPopout2(scope.row)"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="delUser(scope.row.id)"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页结构 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible1" width="50%">
      <el-form
        label-width="80px"
        ref="addUserData"
        :model="addUserData"
        :rules="addUserRules"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addUserData.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input type="password" v-model="addUserData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="addUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogVisible2" width="50%">
      <el-form label-width="80px" :model="altUserData" :rules="addUserRules">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="altUserData.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="altUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="altUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="altUser(altUserData.id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="dialogVisible3"
      :data="altUserData"
    >
      <el-form label-width="100px">
        <p class="cc">当前的用户 ：{{ altUserData.username }}</p>
        <p class="cc">当前的角色 ：{{ altUserData.role_name }}</p>
        <el-form-item label="分配新角色">
          <el-select v-model="usersuId" placeholder="请选择">
            <el-option
              :key="item.id"
              v-for="item in userRoleList"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="altUserRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  mounted() {
    this.getUsersData()
    this.getUserRoleList()
  },
  data() {
    return {
      // 用户数据
      usersData: [],
      // 分页/搜索
      paging: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 用户添加对话框控制
      dialogVisible1: false,
      addUserData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      },
      // 编辑用户信息
      dialogVisible2: false,
      altUserData: [],
      // 修改用户角色
      dialogVisible3: false,
      usersuId: '',
      userRoleList: []
    }
  },
  methods: {
    // 获取用户列表数据
    async getUsersData() {
      const { data: res } = await this.$http.get('users', {
        params: {
          query: this.paging.query,
          pagenum: this.paging.pagenum,
          pagesize: this.paging.pagesize
        }
      })
      this.usersData = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    // 获取用户角色列表
    async getUserRoleList() {
      const { data: res } = await this.$http.get('roles')
      this.userRoleList = res.data
    },
    // 修改用户状态
    async altUserState(row) {
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('用户状态修改失败')
      }
      this.$message.success('用户状态修改成功')
      // console.log(res)
    },
    // 用户添加弹框
    addUserPopout() {
      this.dialogVisible1 = true
    },
    addUser() {
      this.$refs.addUserData.validate(async (valid) => {
        if (!valid) {
          return this.$message.warning('请输入必填选')
        } else {
          const { data: res } = await this.$http.post('users', this.addUserData)
          if (res.meta.status !== 201) {
            return this.$message.error('用户添加失败,可能该用户已存在')
          }
          this.$message.success('用户添加成功')
          this.getUsersData()
          this.dialogVisible1 = false
        }
      })
    },
    // 编辑用户弹框
    altUserPopout(row) {
      this.altUserData = row
      this.dialogVisible2 = true
    },
    async altUser(id) {
      const { data: res } = await this.$http.put(
        `users/${id}`,
        this.altUserData
      )
      if (res.meta.status !== 200) {
        return this.$message.error('编辑用户失败')
      }
      console.log(res)
      this.$message.success('编辑用户成功')
      this.dialogVisible2 = false
      this.getUsersData()
      // console.log(res)
    },
    altUserPopout2(row) {
      this.altUserData = row
      this.dialogVisible3 = true
    },
    async altUserRole() {
      const { data: res } = await this.$http.put(
        `users/${this.altUserData.id}/role`,
        {
          rid: this.usersuId
        }
      )
      if (res.meta.status !== 200) {
        this.usersuId = ''
        return this.$message.error('不允许修改admin账户')
      }
      this.$message.success('角色修改成功')
      this.usersuId = ''
      this.getUsersData()
      this.dialogVisible3 = false
    },
    // 删除用户
    delUser(id) {
      this.$confirm('你要删除这个用户吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`users/${id}`)
        if (res.meta.status === 200) this.$message.success('用户删除成功')
        this.getUsersData()
        // console.log(res)
      })
    },
    // 用户搜索
    searchUser() {
      this.getUsersData()
    },
    // 分页
    handleSizeChange(v) {
      this.paging.pagesize = v
      this.getUsersData()
    },
    handleCurrentChange(v) {
      this.paging.pagenum = v
      this.getUsersData()
    }
  }
}
</script>
<style>
.users .input-with-select {
  width: 500px;
  margin-right: 25px;
}

.cc {
  text-align: left;
  color: #606266;
  font: 14px/40px '微软雅黑';
  padding-left: 19px;
}
</style>
