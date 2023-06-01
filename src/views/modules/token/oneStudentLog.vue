<template>
    <div>
        <div style="display:block; padding-bottom: 10px;">
            <el-input v-model="dataForm.search_text" placeholder="Filter ex. Bonald Dren, Module 1">
            </el-input>
        </div>
        <el-table :data="filteredTableData" border width="100%">
            <template slot="empty">
                <el-empty description="empty">
                    <span>empty~</span>
                </el-empty>
            </template>
            <el-table-column prop="sourceName" label="assignment" :min-width="25" sortable>
            </el-table-column>
            <el-table-column label="operation" prop="type" :min-width="25" sortable>
            </el-table-column>
            <el-table-column prop="tokenCount" label="token count" :min-width="25" sortable>
            </el-table-column>
            <el-table-column prop="timestamp" label="timestamp" :min-width="25" sortable>
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
            tableData: []
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
            this.$http.get('/logs/' + this.$store.state.user.studentID)
            .then(({ data }) => {
                console.log(data)
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
<style>
.el-table .warning-row {
    background: oldlace;
}

.el-table .success-row {
    background: #f0f9eb;
}
</style>