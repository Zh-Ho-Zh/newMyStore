<template>
  <div class="bg">
    <div class="login">
      <h1>商品后台管理系统</h1>
      <el-form :model="loginForm" :rules="loginFromRules" ref="loginForm">
        <el-form-item
          label="账号"
          label-width="100px"
          class="username"
          prop="username"
        >
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          label-width="100px"
          class="password"
          prop="password"
        >
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <div class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" plain @click="reset(loginForm)"
            >重置</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFromRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 6 到 24 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.$http.post('/login', this.loginForm).then((res) => {
            if (res.data.meta.status !== 200) {
              return this.$message.error('账号或密码不正确')
            } else {
              window.sessionStorage.setItem('token', res.data.data.token)
              this.$message.success('登录成功')
              this.$router.push('./Index')
            }
          })
        } else {
          this.$message.error('账号或者密码格式不正确，请按要求输入')
        }
      })
    },
    reset() {
      //   this.$refs[loginForm]
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>
<style scoped>
.bg {
  height: 100%;
  background-size: cover;
  background-image: url(../assets/images/bg.png);
}
.login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 650px;
  height: 330px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
}
.login h1 {
  text-align: center;
  font: bold 36px/42px '宋体';
  color: #15a9e4;
  margin-top: 25px;
}
.login .el-form-item {
  position: absolute;
  width: 570px;
}
.login .username {
  top: 32%;
}
.login .password {
  top: 52%;
}
.login .btn {
  position: absolute;
  top: 72%;
  left: 50%;
  transform: translateX(-50%);
}
.login .btn .el-button {
  width: 100px;
}
</style>
