<template>
    <div>
        <div style="margin-bottom : 10px">
            <el-button type="primary" @click="showAddDialog">Add New Config</el-button>
            <el-button type="succsss" @click="resetFilter">All Config</el-button>
            <el-button type="succsss" @click="filterQuizConfig">Quiz Config</el-button>
            <el-button type="succsss" @click="filterqQaltricsConfig">Qualtrics Config</el-button>
            <el-button type="succsss" @click="filterCanvasConfig">Canvas Config</el-button>
        </div>
        <el-table :data="tableData" border width="100%">
            <template slot="empty">
                <el-empty description="empty">
                    <span>empty~</span>
                </el-empty>
            </template>
            <el-table-column prop="id" label="id" :min-width="10" sortable>
            </el-table-column>
            <el-table-column prop="configType" label="Config Type" :min-width="20" sortable>
            </el-table-column>
            <el-table-column prop="configName" label="Config Name" :min-width="30" sortable>
            </el-table-column>
            <el-table-column prop="timestamp" label="last modified date" :min-width="20" sortable>
            </el-table-column>
            <el-table-column header-align="center" align="center" label="operation" :min-width="20">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="showUpdateDialog(scope.row.id)">update</el-button>
                    <el-button type="danger" size="small" @click="deleteConfig(scope.row.id)">delete</el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-dialog :visible.sync="dialogVisible">
            <span class="title_Dialog">Update Config</span>
            <el-form ref="dataForm" :model="dataForm">
                <el-form-item label="Config Name">
                    <el-input v-model="dataForm.config_name"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="updateConfig()">Confirm</el-button>
        </el-dialog>
        <el-dialog header-align="center" align="center" :visible.sync="AddDialogVisible">
            <span class="title_Dialog">Add new Config</span>
            <el-form ref="formData" :model="formData">
                <el-form-item label="Config Type">
                    <el-input v-model="formData.config_type"></el-input>
                </el-form-item>
                <el-form-item label="Config Name">
                    <el-input v-model="formData.config_name"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="addConfig()">Confirm</el-button>
        </el-dialog>
    </div>
</template>
  
<script>

export default {
    components: {},
    props: {},
    data() {
        return {
           tableData: [],
           cleanTableData: [],
            dialogVisible: false,
            dataForm: {
                tokenNum: 0,
                user_id: 0,
                config_name: ''
            },
            formData: {
                config_type: '',
                config_name: ''
            },
            AddDialogVisible: false
        };
    },
    computed: {
    },
    watch: {},
    methods: {
        loadConfig() {
            this.$http.get('/config').then(({ data }) => {
                this.tableData = data.map(d => {
                    d.timestamp = new Date(d.timestamp).toLocaleString();
                    return d;
                });
                this.cleanTableData = this.tableData
            })
        },
        updateConfig() {
            this.$http.post('/config/update',{
                    'id': this.dataForm.id,
                    'configName': this.dataForm.config_name
                }).then((response ) => {
                console.log(response);
                if (response.status == 200) {
                    this.$message({
                        message: 'Config has been deleted',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.loadConfig()
                        }
                    })
                } else {
                    this.$message.error(response.msg)
                }
                this.dialogVisible = false
                this.loadConfig()
            })
        },
        deleteConfig(id) {
            this.$confirm('Are you sure to delete this config?', 'Warning', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$http.post('/config/delete',{
                    'id': id
                }).then((response) => {
                    console.log(response)
                    if (response.status == 200) {
                        this.$message({
                            message: 'Config has been deleted',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.loadConfig()
                            }
                        })
                    } else {
                        this.$message.error(response.msg)
                    }
                })
            }).catch(() => {
                // do nothing if the user cancels the deletion
            })
        },
        showUpdateDialog(id) {
            const row = this.tableData.find(row => row.id === id);
            if (row) {
                this.dataForm.config_name = row.configName;
                this.dialogVisible = true;
                this.dataForm.id = id;
            }
        },
        showAddDialog() {
            this.AddDialogVisible = true
            this.formData.config_type = ""
            this.formData.config_name = ""
        },
        addConfig() {
            this.$http.post('/config/add', {
                    'configType': this.formData.config_type,
                    'configName': this.formData.config_name
                }).then((response) => {
                    console.log(response);
                    if (response.status == 200) {
                        this.$message({
                            message: 'Config has been created',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.loadConfig()
                            }
                        });
                        this.AddDialogVisible = false
                    } else {
                        this.$message.error(response.msg)
                    }
            });
        },
        filterQuizConfig() {
            this.tableData  = this.cleanTableData.filter(row => row.configType.startsWith('tokenQuiz'))
        },
        filterqQaltricsConfig() {
            this.tableData  = this.cleanTableData.filter(row => row.configType.toLowerCase().startsWith('qualtrics'))
        },
        filterCanvasConfig() {
            this.tableData  = this.cleanTableData.filter(row => row.configType.toLowerCase().startsWith('canvas'))
        },
        resetFilter() {
            this.loadConfig()
        }
        
    },
    created() { },
    mounted() {
        this.loadConfig()
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