<template>
  <main>
    <div class="container">

      <div class="row">
        <label>
          <span  class="btn btn-success">Import labels</span>
          <input type="file" style="display: none;" @change="import_labels_file_changed" />
          <span v-if="$store.state.labels.length > 0">Currently have {{ $store.state.labels.length }} labels.</span>
        </label>
      </div>

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
    import_labels_file_changed(event) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if ((ev.target?.result ?? false) && typeof ev.target?.result === 'string') {
          try {
            const import_raw = ev.target?.result;
            const import_labels = JSON.parse(import_raw)['label_collection']['labels']
            this.import_labels(import_labels)
          } catch {
            // TODO: toast/show error
            alert("No labels found in file")
          }
        }
      };
      const event_target = event.target;
      if (event_target.files != null) {
          reader.readAsText(event_target.files[0]);
      }
    },
    import_labels(labels) {
      // this.labelStudio.createLabel()
      // alert(`Parsed ${labels.length} labels: ${labels.map(x => x.name).join(", ")}`)
      this.$store.commit('set_labels', labels);
    },
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
