<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col">
          <h6>My Tasks: {{ tasks.length }}</h6>
          <div v-for="t in tasks">
              <NuxtLink :to="`/tasks/${t.id}`" class="ddd-nav-link">{{t.id }}</NuxtLink>
          </div>
          <div>
            <h6>Create new task:</h6>
            <b-form-file id="file-small" size="sm" accept=".txt" @change="change_file($event)"></b-form-file>
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
      tasks: [],
      headers: {
            "Authorization": `Token ${env.backend.token}`,
            "Content-Type": "application/json",
        }
    }
  },
  methods: {
    change_file(event) {
      var reader = new FileReader();
      reader.onload = () => {
        fetch(`${env.backend.base_url}/api/projects/${this.id}/import`, { method: "POST", headers: this.headers, body: JSON.stringify({ text: reader.result }) })
            .then(res => res.json())
            .then(res => {
              this.get_tasks()
            })
            .catch(error => {
            console.log(error);
            })
      };
      reader.readAsText(event.target.files[0]);
    },
    get_tasks() {
      fetch(`${env.backend.base_url}/api/projects/${this.id}/tasks/`, {headers: this.headers})
        .then(res => res.json())
        .then(res => {
          console.log(res)
          this.tasks = res;
        })
        .catch(error => {
          console.log(error);
        })
    }
  },
  async asyncData({ params }) {
    const id = params.id
    return { id }
  },
  mounted() {
    this.get_tasks()

  }
};
</script>
