<template>
  <div>
    <el-row>

      <div style="margin-bottom : 10px">
        <el-button type="primary" @click="getLogs()">Refresh </el-button>
        <el-button size="medium">Total Token: {{ tokenNumber }}</el-button>
        <!-- <el-button type="warning" @click:this.$router.push()> check details</el-button> -->
        <el-button type="info" icon="el-icon-message" circle @click="contact"></el-button>
      </div>

    </el-row>
    <div class="form-group">
      <el-table :data="tableData | forStatus" width="100%" v-loading="dataListLoading" border>
        <el-table-column prop="name" label="Assignment Name" :min-width="20" sortable>
        </el-table-column>
        <el-table-column prop="grade" label="Grade" :min-width="8" sortable>
        </el-table-column>
        <el-table-column prop="maxGrade" label="Max Grade" :min-width="8" sortable>
        </el-table-column>
        <el-table-column prop="status" label="status" :min-width="10" sortable>
        </el-table-column>
        <el-table-column prop="token_required" label="Token Required" :min-width="10" sortable>
        </el-table-column>
        <el-table-column prop="deadline" label="Deadline" :min-width="14" sortable>
        </el-table-column>
        <el-table-column header-align="center" align="center" :min-width="20" label="Operation">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="open(scope.row, scope.$index)"
              :disabled="scope.row.token_required > tokenNumber || scope.row.grade == scope.row.maxGrade || scope.row.status == 'overdue' || scope.row.status == 'Not graded yet'">request
              resubmission</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="Resubmission Request" :visible.sync="dialogVisible" :append-to-body="true">
      <span v-html="message"></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="this.dialogVisible = false">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>
    
<script>

export default {
  data() {
    return {
      tableData: [],
      tokenNumber: "N/A",
      userId: this.$store.state.user.studentID,
      dataListLoading: false,
      dialogVisible: false
    }
  },
  filters: {
    forStatus(tableData) {
      return tableData.filter(function (item) {
        if (item.status == "none" || item.status == "overdue" || item.status == "Not graded yet") {
          return item;
        }
      })
    }
  },
  methods: {
    getTokenNumber() {
      this.$http.get('/tokens/' + this.userId)
        .then(({ data }) => {
          if (data.code && data.code !== 0) {
            return this.$message.error(data.msg)
          }
          console.log("total number", data)
          this.tokenNumber = data
      }).catch((e) => {
        console.log(e)
        });
    },
    contact() {
      this.$alert('If you have 3 tokens, contact teaching assistants teachingAssistant@uci.edu', 'Message', {
        confirmButtonText: 'Done',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          });
        }
      });
    },
    getAssignmentStatus() {
      console.log(this.$store.state.user);
      this.dataListLoading = true
      this.$http.get('/assignment_status/' + this.userId)
      .then(({ data }) => {
        // console.log(data)
        for (let i = 0; i < data.length; i++) {
          data[i].deadline = new Date(data[i].deadline).toLocaleString();
        }
        this.tableData = data;
        this.dataListLoading = false
      })
    },
    OverideAssignment() {
      // log.console("hello")
    },
    open(data, index) {
      this.dataListLoading = true
      this.$confirm('Do you want a resubmission?', 'Alert', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        //to do 
        console.log(data)
        this.$http.post('/request/',{
            'studentId': this.userId,
            'assignmentId': data.assignment_id,
            'assignmentName': data.name,
            'tokenCount': data.token_required,
          }).then((response) => {
          // console.log(response.data)
          if (response.data.assignment_id != "failed") {
            data.status = "submitted"
            // this.$set(this.tableData,index,row)
            // console.log(data.token_required)
            this.tokenNumber = this.tokenNumber - data.token_required
            // window.open('https:\\canvas.instructure.com/courses/3737737/assignments/'+ data.resubmission_id, '_blank'),
            // this.message = 'Success!<br> Your Resubmission link is ' + '<a href="https://canvas.instructure.com/courses/3737737/assignments/' + data.resubmission_id + '">https://canvas.instructure.com/courses/3737737/assignments/' + data.resubmission_id + '</a>';
            // this.dialogVisible = true
            this.$message({
              type: 'success',
              message: "Resubmission request is submitted"
            });
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
    }
  },
  computed: {
  },
  watch: {

  },
  mounted() {
    this.getAssignmentStatus(),
      this.getTokenNumber()
  },
}
</script>