<template>
  <div class="about py-4 mx-lg-auto mx-5" style="max-width: 992px">
    <!-- <VueShowdown markdown="**Testing 123**   :)  :smile" /> -->
    <!-- flavor="github" -->
    <!-- :options="{ emoji: true }" -->
    <!-- target="blank -->
    <vue-markdown :source="fileContent" />
    <!-- <vue-showdown :markdown="fileContent" /> -->
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
// import { VueShowdown } from 'vue-showdown'
import mdFile from '../../README.md'

export default {
  components: {
    VueMarkdown,
    // VueShowdown,
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
