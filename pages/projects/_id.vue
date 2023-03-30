<template>
    <main>
      <div class="container">
        <div class="row">
          <div class="col">
            <h6>My Tasks: {{ tasks.length }}</h6>
            <div v-for="t in tasks">
                <NuxtLink :to="`/tasks/${t.id}`" class="ddd-nav-link">{{t.id }}</NuxtLink>
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
        tasks: []
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
        fetch(`http://localhost:8080/api/projects/${this.id}/tasks/`, options)
          .then(res => res.json())
          .then(res => { 
            console.log(res)
            this.tasks = res;
          })
          .catch(error => {
           console.log(error);
          })
    }
  };
  </script>
  