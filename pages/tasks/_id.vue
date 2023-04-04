<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col">
          <h6>Task: {{ task.id }}</h6>
          <NuxtLink :to="`/annotator?task_id=${task.id}`">annotate</NuxtLink>
          <div>
            {{ task }}
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import env from '~/environment.json'

export default {
  data() {
    return {
      task: []
    }
  },
  methods: {
  },
  async asyncData({ params }) {
    const id = params.id
    return { id }
  },
  mounted() {
    const options = {
          headers: {
              "Authorization": `Token ${env.backend.token}`
          }
      };
      fetch(`${env.backend.base_url}/api/tasks/${this.id}`, options)
        .then(res => res.json())
        .then(res => {
          console.log(res)
          this.task = res;
        })
        .catch(error => {
         console.log(error);
        })
  }
};
</script>
