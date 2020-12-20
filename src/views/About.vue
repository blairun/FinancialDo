<template>
  <div class="about py-4">
    <!-- <h3>This is an about page</h3> -->
    <div class="mx-5">
      <vue-markdown :source="fileContent" />
    </div>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
// import mdFile from '../../../README.md'
import mdFile from '../../README2.md'

export default {
  components: {
    VueMarkdown,
  },
  data() {
    return {
      fileContent: '',
    }
  },
  mounted() {
    this.getMDFile()
    this.$store.commit('updateBooleanStates', {
      prop: 'updateButtonVisible',
      state: false,
    })
    this.$store.commit('updateBooleanStates', {
      prop: 'datePickerVisible',
      state: false,
    })
  },
  methods: {
    getMDFile() {
      this.fileContent = mdFile
    },
  },
}
</script>

<style></style>
