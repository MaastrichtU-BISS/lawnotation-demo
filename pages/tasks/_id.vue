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
              "Authorization": "Token 8241751f6fcf57f6e438bbbaf766aebcab647d6a"
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
