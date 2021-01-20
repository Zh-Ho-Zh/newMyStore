<template>
  <el-container class="index">
    <el-header>
      商城后台管理系统
      <el-button type="primary" class="exit" @click="exit">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="this.foldControl ? '64px' : '200px'">
        <span class="fold" @click="fold">| | |</span>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          menu-trigger="click"
          :unique-opened="true"
          :router="true"
          :collapse="this.foldControl"
          :collapse-transition="false"
        >
          <el-submenu
            v-for="item in menuBar"
            :key="item.id"
            :index="String(item.id)"
          >
            <template slot="title">
              <i :class="icon[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="itemson in item.children"
              :key="itemson.id"
              :index="String(itemson.path)"
            >
              <i class="el-icon-menu"></i>{{ itemson.authName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  mounted() {
    this.getLeftList()
  },
  data() {
    return {
      menuBar: [],
      icon: {
        125: 'iconfont icon-ziyuan',
        103: 'iconfont icon-quanxian',
        101: 'iconfont icon-goods-copy',
        102: 'iconfont icon-dingdan2',
        145: 'iconfont icon-shujutongji'
      },
      foldControl: false
    }
  },
  methods: {
    async getLeftList() {
      const { data: res } = await this.$http.get('menus')
      this.menuBar = res.data
    },
    fold() {
      this.foldControl = !this.foldControl
    },
    exit() {
      window.sessionStorage.clear()
      this.$router.push('./Login')
    }
  }
}
</script>
<style>
.el-header {
  background: #373d41;
  line-height: 60px;
  color: #fff;
  font-size: 18px;
}
.el-container {
  height: 100%;
}
.el-aside {
  background: #333744;
}
.el-aside i {
  margin-right: 15px;
}
.fold {
  display: inline-block;
  width: 100%;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
.exit {
  float: right;
  margin-top: 10px;
}
</style>
