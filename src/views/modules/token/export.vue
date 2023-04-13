<template>
    <div>
        <div style="margin-bottom : 10px">
            <el-button type="primary" @click="getExport()">Export all data </el-button>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {},
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
        async getExport() {
            try {
            const { data } = await this.$http.get('/exportall', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'nameYourFileHere.csv');
            document.body.appendChild(link);
            link.click();
            } catch (error) {
            console.error('Error exporting data:', error);
            // Show an error message to the user
            }
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