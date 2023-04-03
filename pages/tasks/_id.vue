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
              "Authorization": "Token ac9094e3ae134e545a4fbdd3b9edbbcebc4ee2ed"
          }
      };
      fetch(`http://localhost:8080/api/tasks/${this.id}`, options)
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
