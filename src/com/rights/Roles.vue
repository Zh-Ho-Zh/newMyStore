<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="rolesData" style="width: 100%" border>
        <el-table-column type="expand"></el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">123 </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  mounted() {
    this.getRolesData()
  },
  data() {
    return {
      rolesData: []
    }
  },
  methods: {
    async getRolesData() {
      const { data: res } = await this.$http.get('roles')
      this.rolesData = res.data
    }
  }
}
</script>
<style>
</style>
