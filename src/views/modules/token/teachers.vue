<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <template slot="empty">
                <el-empty description="empty">
                    <span>empty~</span>
                </el-empty>
            </template>
      <el-table-column prop="userId" label="Student id" width="180">
      </el-table-column>
      <el-table-column prop="type" label="Type" width="180">
      </el-table-column>
      <el-table-column prop="source" label="Source" width="180">
      </el-table-column>
      <el-table-column prop="timestamp"  label="Time" width="180">
      </el-table-column>
      <el-table-column prop="tokenCount" label="Token Need" width="180">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  components: {},
  props: {},
  data() {
    return {
      tableData: []
    };
  },
  computed: {},
  watch: {},
  methods: {
    formatTime(row, column){
     let  date = row[column.property];
     if(date === undefined){
         return ''}
     return (date).format("YYYY-MM-DD HH:mm:ss")
    },
    getCourses() {
      this.$http({
        url: this.$http.adornUrl('/logs'),
        method: 'get',

      }).then(({ data }) => {
        this.tableData = data
      })
    }
  },
  created() {  },
  mounted() { this.getCourses()
  },
  beforeCreated() { },
  beforeMounted() { },
  beforeUpdate() { },
  updated() { },
  beforeDestory() { },
  destoryed() { },
  actived() { }
}

</script>
<style lang='css' scoped>

</style>