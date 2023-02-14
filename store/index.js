export const state = () => ({
    text_to_annotate: "",
    initial_annotations: [],
    parsed_doc: {},
    doc_link: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32013R1308&qid=1673876842533&from=EN",
    labels: []
  })

  export const mutations = {
    set_text_to_annotate (state, text) {
      state.text_to_annotate = text;
    },
    set_annotations (state, annotations) {
      state.initial_annotations = annotations;
    },
    set_parsed_doc (state, doc) {
      state.parsed_doc = doc;
    },
    set_doc_link (state, link) {
      state.doc_link = link;
    },
    set_labels (state, labels) {
      state.labels = labels;
    }
  }
