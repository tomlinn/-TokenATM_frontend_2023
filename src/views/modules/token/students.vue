<template>
    <div>
        <div style="margin-bottom : 10px">
            <el-button type="primary" @click="sync()">manually sync</el-button>
        </div>
        <div style="display:block; padding-bottom: 10px;">
            <el-input v-model="dataForm.search_text" placeholder="Filter ex. Bonald Dren, Module 1" >
            </el-input>
        </div>
        <el-table :data="filteredTableData" border width="100%" v-loading="dataListLoading">
            <template slot="empty">
                <el-empty description="empty">
                    <span>empty~</span>
                </el-empty>
            </template>
            <el-table-column prop="user_id" label="Student id" :min-width="10" sortable>
            </el-table-column>
            <el-table-column prop="user_name" label="Student name" :min-width="20" sortable>
            </el-table-column>
            <el-table-column prop="token_count" label="Student tokens" :min-width="20" sortable>
            </el-table-column>
            <el-table-column prop="user_email" label="Student Email" :min-width="30" sortable>
            </el-table-column>
            <el-table-column header-align="center" align="center" :min-width="20" label="operation">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="updateToken(scope.row.user_id)">update token</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog header-align="center" align="center"  :visible.sync="dialogVisible">
            <span class="title_Dialog">Update Token Amount</span>
            <el-form ref="dataForm" :model="dataForm">
                <el-form-item label="Token Amount">
                <el-input v-model="dataForm.TokenCount" placeholder="token"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="submit()">Confirm</el-button>
        </el-dialog>
    </div>
</template>
  
<script>

export default {
    components: {},
    props: {},
    data() {
        return {
            //            tableData: [{'user_id':"123", 'token_count':123, 'user_email':'123@gmail'},{'user_id':'345','token_count':123,user_email:'446@gmail.com'}],
            tableData: [],
            dialogVisible: false,
            dataForm: {
                TokenCount: 0,
                user_id: 0,
                search_text: ""
            },
            dataListLoading: false
            
        };
    },
    computed: {
        filteredTableData() {
            const searchText = this.dataForm.search_text.toLowerCase();
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
    watch: {},
    methods: {
        getStudentList() {
            this.$http.get('/students').then(({ data }) => {
                this.tableData = data
            });
        },
        submit() {
            
            this.$http.post('/update',{
                    'studentId': this.dataForm.user_id,
                    'tokenCount': this.dataForm.TokenCount
                }).then(( response ) => {
                console.log(response)
                if (response.status == 200) {
                    this.$message({
                        message: 'Token amount has been updated',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.dialogVisible = false
                            this.getStudentList()
                        }
                    })
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        updateToken(student_id) {
            const row = this.tableData.find(row => row.user_id === student_id);
            if (row) {
                this.dataForm.TokenCount = row.token_count
                this.dataForm.user_id = student_id
                this.dialogVisible = true
            }
        },
        sync() {
            this.dataListLoading = true
            this.$http.get('/sync').then(({ data }) => {
                alert("sync successfully")
                this.dataListLoading = false
            })
        }
    },
    created() { },
    mounted() {
        this.getStudentList()
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
    .title_Dialog {
    font-weight: bold;
    font-size: 18px;
    }
</style>