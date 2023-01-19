<template>
    <main>
      <div class="container">
        <div class="row">
          <div class="col">
            <Annotator :text="text_to_annotate"/>
          </div>
        </div>
      </div>
    </main>
</template>
  
<script>
import Annotator from '../../components/Annotator.vue';

export default {
    computed: {
        text_to_annotate() {
            return this.$store.state.text_to_annotate;
        }
    },
    mounted() {
        
    },
    components: { Annotator }
};
  </script>