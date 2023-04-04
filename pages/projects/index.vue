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
  import env from '~/environment.json'

  export default {
    data() {
      return {
        projects: [],
      }
    },
    methods: {

    },
    mounted() {
        const options = {
            headers: {
                "Authorization": `Token ${env.backend.token}`
            }
        };
        fetch(`${env.backend.base_url}/api/projects`, options)
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
