export default {
  state: {
    id: 0,
    name: '',
    superAdmin: 0,
    studentID: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateStudentId (state, id) {
      state.studentID = id
    }
  }
}
