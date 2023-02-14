<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col text-center">
          <h3>Upload text with annotations:</h3>
          <b-form-file id="file-small" size="sm" accept=".json" @change="change_file($event)"></b-form-file>
          <NuxtLink id="annotator_link" class="d-none" to="/annotator">annotate</NuxtLink>
          <h3 class="mt-5">Or parse document from https://eur-lex.europa.eu/</h3>
          <Preprocessor/>
        </div>
      </div>
    </div>
  </main>
</template>

<script>

export default {
  data() {
    return {

    }
  },
  methods: {
    change_file(event) {
      var reader = new FileReader();
      reader.onload = () => {
        var fileContent = JSON.parse(reader.result);
        this.$store.commit('set_text_to_annotate', fileContent.text);
        this.$store.commit('set_annotations', fileContent.annotations);
        document.getElementById('annotator_link').click()
      };
      reader.readAsText(event.target.files[0]);
    },
  },
  mounted() {
  }
};
</script>
