<template>
  <div>
    <b-overlay :show="loading" rounded="sm">
      <b-input-group class="my-3">
      <b-form-input id="url_input" aria-placeholder="url"></b-form-input>
        <b-input-group-append>
          <b-button @click="post_text" size="sm" variant="dark">Parse</b-button>
        </b-input-group-append>
      </b-input-group>
      <div class="row">
        <div class="col-4">
          <div v-show="!loading">
            <h3>Parsed Document</h3>
            <div v-for="fragment in parsed_doc['order']" :key="'fragment_'+ fragment">
              <h4 class="text-uppercase">{{ fragment }}:</h4>
              <ol>
                <li v-for="(subfragment, index) in parsed_doc[fragment]" :key="'fragment_' + fragment + '_' + index">
                  <a href="#preview" class="ml-3 btn btn-link" style="outline: none"  @click="preview_text = subfragment">preview</a>
                  <button class="btn btn-link sm mx-3" style="outline: none" @click="goToAnnotate(subfragment)">annotate</button>
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div class="col-8">
          <div v-show="!loading">
            <h3 id="preview">Preview</h3>
            <div style="white-space: pre-wrap;">{{ preview_text }}</div>
          </div>
        </div>
      </div>
    </b-overlay>
  </div>
</template>
  
<script>
  export default {
    computed: {
        parsed_doc() {
            return this.$store.state.parsed_doc;
        },
        doc_link() {
          return this.$store.state.doc_link;
        }
    },
    data() {
      return {
       loading: false,
       preview_text: ""
      }
    },
    methods: {
      goToAnnotate(subfragment) {
        this.$store.commit('set_text_to_annotate', subfragment);
        this.$store.commit('set_annotations', []);
        document.getElementById('annotator_link').click()
      },
      async post_text() {
        this.loading = true;
        this.preview_text = "";
        const text_url = document.getElementById("url_input").value;
        this.$store.commit('set_doc_link', text_url);

        const options = {
            method: 'POST',
            body: text_url,
            headers: {
                'Content-Type': 'text/plain'
            }
        }

        fetch('/api/preprocess', options)
        .then(res => res.json())
        .then(res => { 
          console.log(res)
          this.$store.commit('set_parsed_doc', res);
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        })
      }
    },
    mounted() {
      document.getElementById("url_input").value = this.doc_link;
    }
  };
</script>