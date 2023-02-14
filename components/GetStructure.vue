<template>
    <div>
      <b-overlay :show="loading" rounded="sm">
        <b-input-group class="my-3">
        <b-form-input id="url_input" aria-placeholder="url"></b-form-input>
          <b-input-group-append>
            <b-button @click="post_text" size="sm" variant="dark">Parse</b-button>
          </b-input-group-append>
        </b-input-group>
        <div v-show="!loading" class="row">
            <div class="col">
                <div style="min-height: 70vh;" id="json-viewer"></div>
            </div>
        </div>
      </b-overlay>
    </div>
</template>
    
<script>
import JsonViewer from '../node_modules/json-viewer-js/src/jsonViewer';
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
         json: {}
        }
      },
      methods: {
        async post_text() {
          this.loading = true;
          this.json = {};
          const text_url = document.getElementById("url_input").value;
          this.$store.commit('set_doc_link', text_url);
  
          const options = {
              method: 'POST',
              body: text_url,
              headers: {
                  'Content-Type': 'text/plain'
              }
          }
  
          fetch('/api/get_structure', options)
          .then(res => res.json())
          .then(res => { 
            console.log(res)
            this.json = res
            new JsonViewer({
                container: document.getElementById("json-viewer"), 
                data: JSON.stringify(this.json), 
                theme: 'dark', 
                expand: false
            });
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