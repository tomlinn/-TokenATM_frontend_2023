<template>
  <div>
    <div style="margin-bottom : 10px">
        <el-button type="primary" @click="getAssignmentStatus()">Refresh </el-button>
    </div>
    <el-table :data="tableData | forStatus" style="width: 100%" v-loading="dataListLoading">
      <template slot="empty">
        <el-empty description="empty">
          <span>empty~</span>
        </el-empty>
      </template>
      <el-table-column prop="name" label="Assignment Name" :min-width="20" sortable>
      </el-table-column>
      <el-table-column prop="grade" label="Grade" :min-width="15" sortable>
      </el-table-column>
      <el-table-column prop="maxGrade" label="Max Grade" :min-width="15" sortable>
      </el-table-column>
      <el-table-column prop="status" label="status" :min-width="15" sortable>
      </el-table-column>
      <el-table-column prop="token_required" label="Token Required" :min-width="15" sortable>
      </el-table-column>
      <el-table-column header-align="center" align="center" :min-width="20" label="Action">
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="cancel(scope.row, scope.$index)">
            Cancel resubmission
          </el-button>
          <el-button v-if="scope.row.status === 'Approved'" type="primary" size="small"
            @click="openResubmissionLink(scope.row.resubmission_id)">
            Link
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      userId: this.$store.state.user.studentID,
      dataListLoading: false,
      dialogVisible: false
    }
  },
  filters: {
    forStatus(listData) {
      return listData.filter(function (item) {
        if (item.status == "Approved" || item.status == "Pending") {
          return item;
        }
      })
    }
  },
  methods: {
    cancel(data, index) {
      this.dataListLoading = true
      this.$confirm('Do you want cancel a resubmission?', 'Alert', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        //to do 
        console.log(data)
        this.$http.post('/cancel/',{
          'studentId': this.userId,
          'assignmentId': data.assignment_id,
          'tokenCount': data.token_required
        }).then((response) => {
          // console.log(response.data)
          if (response.data.assignment_id != "failed") {
            data.status = "submitted"
            // this.$set(this.tableData,index,row)
            // console.log(data.token_required)
            this.tokenNumber = this.tokenNumber - data.token_required,
              // auto-open
              // window.open('https:\\canvas.instructure.com/courses/3737737/assignments/'+ data.resubmission_id, '_blank'),
              this.$message({
                type: 'success',
                message: 'Resubmission has been canceled'
              })
          }
          else {
            this.$message({
              type: 'info',
              message: response.data.message
            });
          }
          this.dataListLoading = false
        })
      }).catch((e) => {
        console.log(e)
        this.$message({
          type: 'info',
          message: 'Cancel'
        });
        this.dataListLoading = false
      });
    },
    openResubmissionLink(resubmission_id) {
      window.open("https://canvas.instructure.com/courses/3737737/assignments/" + resubmission_id, '_blank');
    },
    getAssignmentStatus() {
      this.dataListLoading = true
      this.$http.get('/assignment_status/' + this.$store.state.user.studentID)
      .then(({ data }) => {
        console.log(data)
        this.tableData = data
        this.dataListLoading = false
      })
    }
  },
  mounted() {
    this.getAssignmentStatus()
  },
}
</script>