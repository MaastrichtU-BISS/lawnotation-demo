<template>
    <div>
      <b-overlay :show="loading" rounded="sm">
        <b-input-group class="my-3">
        <b-form-input id="url_input" aria-placeholder="url"></b-form-input>
          <b-input-group-append>
            <b-button @click="post_text" size="sm" variant="dark">Parse</b-button>
          </b-input-group-append>
        </b-input-group>
        <div v-show="!loading">
            <div class="row py-2" v-show="json">
                <div class="col text-center">
                    <b-button @click="expand_collapse" class="mr-3" size="sm" variant="dark">{{ expand_collapse_label }}</b-button>
                    <b-button @click="export_json" size="sm" variant="dark">Export JSON</b-button>
                    <a id="download_json" class="d-none"></a>
                </div>
            </div>
            <div class="row py-2">
                <div class="col">
                    <div id="json-viewer-container">
                        <div style="min-height: 65vh;" id="json-viewer"></div>
                    </div>
                </div>
            </div>
        </div>
      </b-overlay>
    </div>
</template>
    
<script>
import JsonViewer from '../node_modules/json-viewer-js/src/jsonViewer';
export default {
    computed: {
        doc_link() {
            return this.$store.state.doc_link;
        },
        expand_collapse_label() {
            return this.collapsed ? "Expand All" : "Collapse All";
        }
      },
      data() {
        return {
         loading: false,
         json: null,
         json_viewer: null,
         collapsed: true
        }
      },
      methods: {
        export_json() {
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.json));
            var dlAnchorElem = document.getElementById('download_json');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", "structure.json");
            dlAnchorElem.click();
        },
        load_json_viewer(expand) {
            const container = document.getElementById("json-viewer-container");
            container.removeChild(container.firstChild);
            var new_el = document.createElement('div');
            new_el.id = "json-viewer";
            new_el.style.minHeight = "65vh";
            container.appendChild(new_el);
            new JsonViewer({
                container: document.getElementById("json-viewer"), 
                data: JSON.stringify(this.json), 
                theme: 'dark', 
                expand: expand
            });
        },
        expand_collapse() {
            this.load_json_viewer(this.collapsed);
            this.collapsed = !this.collapsed;
        },
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
            this.json = res;
            this.collapsed = true;
            this.load_json_viewer(false);
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            this.collapsed = true;
          })
        }
      },
      mounted() {
        document.getElementById("url_input").value = this.doc_link;
      }
    };
  </script>