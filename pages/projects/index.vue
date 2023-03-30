<template>
    <main>
      <div class="container">
        <div class="row">
          <div class="col">
            <h6>My Projects: {{ projects.count }}</h6>
            <div v-for="p in projects.results">
                <NuxtLink :to="'/projects/' + p.id" class="ddd-nav-link">{{p.id + ":" + p.title }}</NuxtLink>
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
        projects: []
      }
    },
    methods: {
    },
    mounted() {
        const options = {
            headers: {
                "Authorization": "Token 8241751f6fcf57f6e438bbbaf766aebcab647d6a"
            }
        };
        fetch('http://localhost:8080/api/projects', options)
          .then(res => res.json())
          .then(res => { 
            console.log(res)
            this.projects = res;
          })
          .catch(error => {
           console.log(error);
          })
    }
  };
  </script>
  