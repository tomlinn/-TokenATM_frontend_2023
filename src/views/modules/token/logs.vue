<template>
    <div>
        <div style="margin-bottom : 10px">
            <el-button type="primary" @click="getLogs()">Refresh </el-button>
        </div>
        <div style="display:block; padding-bottom: 10px;">
            <el-input v-model="dataForm.search_text" placeholder="Filter ex. Bonald Dren, Module 1" >
            </el-input>
        </div>
        <el-table :data="filteredTableData" border width="100%" v-loading="dataListLoading">
            <el-table-column prop="id" label="id" :min-width="5" sortable="">
            </el-table-column>
            <el-table-column prop="userId" label="Student id" :min-width="10" sortable="">
            </el-table-column>
            <el-table-column prop="user_name" label="Student name" :min-width="20" sortable="">
            </el-table-column>
            <el-table-column label="operation" prop="type" :min-width="10" sortable="">
            </el-table-column>
            <el-table-column prop="source" label="assignment id" :min-width="25" sortable="">
            </el-table-column>
            <el-table-column prop="sourceName" label="Name" :min-width="25" sortable="">
            </el-table-column>
            <el-table-column prop="timestamp" label="timestamp" :min-width="20" sortable="">
            </el-table-column>
            <el-table-column prop="tokenCount" label="used token" :min-width="10" sortable="">
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
            dataForm: {
                search_text: ""
            },
            dataListLoading: false,
            tableData:[]
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
        getLogs() {
            this.$http.get('/logs')
            .then(({ data }) => {
                this.tableData = data.map(d => {
                    d.timestamp = new Date(d.timestamp).toLocaleString();
                    return d;
                });
            })
        }
    },
    created() { },
    mounted() { this.getLogs() },
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