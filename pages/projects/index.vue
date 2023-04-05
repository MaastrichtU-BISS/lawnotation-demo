<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h6>My Projects: {{ projects.count }}</h6>
          <div v-for="p in projects.results">
            <NuxtLink :to="'/projects/' + p.id" class="ddd-nav-link">{{
              p.id + ":" + p.title
            }}</NuxtLink>
          </div>
        </div>

        <div class="col-4">
          <form @submit.prevent="addProject(projectName)" class="mt-5">
            <label for="projectName" class="form-label">Project name</label>
            <input
              type="text"
              id="projectName"
              class="form-control"
              v-model="projectName"
            />
            <button type="submit" class="btn btn-primary mt-2">Add project</button>
          </form>
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
      projectName: "",
      options: {
        headers: {
          Authorization: `Token ${env.backend.token}`,
        },
      },
    };
  },

  methods: {
    async addProject(projectName) {
      const options = JSON.parse(JSON.stringify(this.options));
      options.method = "POST";
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify({ title: projectName });

      await fetch(`${env.backend.base_url}/api/projects`, options);
      this.getProjects();
    },

    getProjects() {
      console.log(this.options)
      fetch(`${env.backend.base_url}/api/projects`, this.options)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          this.projects = res;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

  mounted() {
    this.getProjects();
  },
};
</script>
