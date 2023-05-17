<template>
  <div>
    <div style="margin-bottom : 10px">
      <el-button type="primary" @click="getPendingRequests()">Refresh</el-button>
      <el-button type="primary" @click="approveAllRequest()">Approve All</el-button>
      <el-button type="succsss" @click="resetFilter">All Request</el-button>
      <el-button type="succsss" @click="filterApproved">Approved</el-button>
      <el-button type="succsss" @click="filterPending">Pending</el-button>
      <el-button type="succsss" @click="filterCancelled">Cancelled</el-button>
      <el-button type="succsss" @click="filterRejected">Rejected</el-button>
    </div>
    <div style="display:block; padding-bottom: 10px;">
        <el-input v-model="search_text" placeholder="Filter ex. Bonald Dren, Module 1" >
        </el-input>
    </div>
    <el-table :data="filteredTableData" style="width: 100%" v-loading="dataListLoading" border>
      <template slot="empty">
        <el-empty description="empty">
          <span>No pending requests</span>
        </el-empty>
      </template>
      <el-table-column prop="id" label="ID" :min-width="10" sortable>
      </el-table-column>
      <el-table-column prop="assignmentId" label="Assignment ID" :min-width="10" sortable>
      </el-table-column>
      <el-table-column prop="studentName" label="Student Name" :min-width="10" sortable>
      </el-table-column>
     <el-table-column prop="studentId" label="Student ID" :min-width="10" sortable>
      </el-table-column>
      <el-table-column prop="tokenCount" label="Token Count" :min-width="10" sortable>
      </el-table-column>
      <el-table-column prop="status" label="Status" :min-width="10" sortable>
      </el-table-column>
      <el-table-column label="Action" :min-width="20">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 'Pending'" type="primary" size="small" @click="approveRequest(scope.row)">
            Approve
          </el-button>
          <el-button v-if="scope.row.status === 'Pending'" type="danger" size="small" @click="rejectRequest(scope.row)">
            Reject
          </el-button>
          <el-tag v-else-if="scope.row.status === 'Approved'" @click="cancel(scope.row, scope.$index)" type="danger">
            Revoke
          </el-tag>
          <el-tag v-else-if="scope.row.status === '(Rejected)'" type="danger">
            Rejected
          </el-tag>
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
      cleanTableData: [],
      dataListLoading: false,
      search_text: ""
    };
  },
  computed: {
        filteredTableData() {
          const searchText = this.search_text.toLowerCase();
          console.log(searchText)
          return this.tableData.filter(
            (row) =>
              Object.values(row).some(
                (value) =>
                  value &&
                  typeof value === "string" &&
                  value.toLowerCase().includes(searchText)
              )
          );
        }
    },
  methods: {
    getPendingRequests() {
      this.dataListLoading = true;
      this.$http.get('/requests/pending/')
      .then(({ data }) => {
        this.tableData = data;
        this.cleanTableData = this.tableData;
        this.dataListLoading = false;
      });
    },
    approveRequest(request) {
      this.$confirm(`Do you want to approve ${request.student_name}'s request for ${request.token_count} tokens for the assignment ${request.assignment_name}?`, 'Alert', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        this.$http.post(`/requests/approve/${request.id}`)
        .then((response) => {
          console.log(response);
          if (response.data.assignment_id != "failed") {
            request.status = 'Approved';
            this.$message({
              type: 'success',
              message: 'Request approved',
            });
          } else {
            this.$message({
              type: 'info',
              message: response.data.message
            })
          }
        }).catch((error) => {
          console.log(error.response);
          this.$message({
            type: 'warning',
            message: 'Error: ' + error.response.data,
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Approval canceled',
        });
      });
    },
    approveAllRequest() {
      this.$confirm(`Do you want to approve all requests?`, 'Alert', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        this.$http.post(`/requests/approveall`)
        .then((response) => {
          console.log(response);
          if (response.data.assignment_id != "failed") {
            this.getPendingRequests();
          } else {
            this.$message({
              type: 'warning',
              message: response.data.message
            })
          }
        }).catch((error) => {
          console.log(error.response);
          this.$message({
            type: 'warning',
            message: 'Error: ' + error.response.data,
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Approval canceled',
        });
      });
    },
    rejectRequest(request) {
      this.loading = true;
      this.$http.post(`/requests/reject/${request.id}`)
      .then((response) => {
          console.log(response);
          if (response.data.assignment_id != "failed") {
            request.status = '(Rejected)';
            this.$message({
              type: 'success',
              message: 'Request rejected',
            });
          } else {
            this.$message({
              type: 'info',
              message: response.data.message
            })
          }
        }).catch((error) => {
          console.log(error.response);
          this.$message({
            type: 'warning',
            message: 'Error: ' + error.response.data,
          });
        });
    },
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
            'studentId': data.studentId,
            'assignmentId': data.assignmentId,
            'tokenCount': data.tokenCount,
          }).then((response) => {
          if (response.data.assignment_id != "failed") {
            data.status = "Cancelled"
             this.$message({
              type: 'success',
              message: 'Resubmission has been canceled'
            })
          }
          else {
            this.$message({
              type: 'warning',
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
    filterApproved() {
        this.tableData  = this.cleanTableData.filter(row => row.status.startsWith('Approved'))
    },
    filterPending() {
        this.tableData  = this.cleanTableData.filter(row => row.status.startsWith('Pending'))
    },
    filterCancelled() {
        this.tableData  = this.cleanTableData.filter(row => row.status.startsWith('Cancelled'))
    },
    filterRejected() {
        this.tableData  = this.cleanTableData.filter(row => row.status.startsWith('Rejected'))
    },
    resetFilter() {
        this.getPendingRequests()
    }
  },
  mounted() {
    this.getPendingRequests();
  },
}
</script>
