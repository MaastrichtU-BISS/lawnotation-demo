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
            <h2>Parsed Document</h2>
            <div v-for="fragment in parsed_doc['order']" :key="'fragment_'+ fragment">
              <h4 class="text-uppercase">{{ fragment }}:</h4>
              <ol>
                <li v-for="(subfragment, index) in parsed_doc[fragment]" :key="'fragment_' + fragment + '_' + index">
                  <a class="ml-3" :href="'#preview'" @click="preview_text = subfragment">preview</a>
                  <a class="mx-3" :href="'#'">annotate</a>
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div class="col-8">
          <div v-show="!loading">
            <h2 id="preview">Preview</h2>
            <div style="white-space: pre-wrap;">{{ preview_text }}</div>
          </div>
        </div>
      </div>
    </b-overlay>
  </div>
</template>
  
<script>
  export default {
    data() {
      return {
       parsed_doc: {},
       loading: false,
       preview_text: ""
      }
    },
    methods: {
      async post_text() {
        this.loading = true;
        this.parsed_doc = {};
        this.preview_text = "";
        const text_url = document.getElementById("url_input").value;

        const options = {
            method: 'POST',
            body: text_url,
            headers: {
                'Content-Type': 'text/plain'
            }
        }

        fetch('http://localhost:3000/api/preprocess', options)
        .then(res => res.json())
        .then(res => { 
          console.log(res)
          this.parsed_doc = res;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        })
      }
    },
    mounted() {
      document.getElementById("url_input").value = "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32013R1308&qid=1673876842533&from=EN";
    }
  };
</script>