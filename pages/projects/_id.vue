<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col">
          <h6>My Tasks: {{ tasks.length }}</h6>
          <div v-if="tasks.length">
            <div v-for="t in tasks">
              <NuxtLink :to="`/tasks/${t.id}`" class="ddd-nav-link">{{ t.id }}</NuxtLink>
            </div>
          </div>
          <div>
            <h6>Create new task:</h6>
            <b-form-file
              id="file-small"
              size="sm"
              accept=".txt,.pdf"
              @change="change_file($event)"
            ></b-form-file>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import env from "~/environment.json";

export default {
  data() {
    return {
      tasks: [],
      headers: {
        Authorization: `Token ${env.backend.token}`,
        "Content-Type": "application/json",
      },
    };
  },
  methods: {
    async change_file(event) {
      console.log(event.target.files[0]);
      const textExtractor = new TextExtractor().createTextExtractorForFile(
        event.target.files[0]
      );
      const text = await textExtractor.getText();
      fetch(`${env.backend.base_url}/api/projects/${this.id}/import`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({ text }),
      })
        .then((res) => res.json())
        .then((res) => {
          this.get_tasks();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    get_tasks() {
      fetch(`${env.backend.base_url}/api/projects/${this.id}/tasks/`, {
        headers: this.headers,
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          this.tasks = res;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  async asyncData({ params }) {
    const id = params.id;
    return { id };
  },
  mounted() {
    this.get_tasks();
  },
};

class TextExtractor {
  createTextExtractorForFile(file) {
    const extension = file.name.split(".").at(-1);

    if (extension === "pdf") {
      return new PdfTextExtractor(file);
    }

    return new PlainTextExtractor(file);
  }
}

class PdfTextExtractor {
  constructor(file) {
    this.file = file;
  }

  async getText() {
    const formData = new FormData();
    formData.append("pdfFile", this.file);
    const response = await fetch("http://localhost:5000/extract-text", {
      method: "POST",
      body: formData,
    });
    return response.text();
  }
}

class PlainTextExtractor {
  constructor(file) {
    this.file = file;
  }

  async getText() {
    const reader = new FileReader();
    reader.readAsText(this.file);
    await new Promise((resolve) => (reader.onload = () => resolve()));
    return reader.result;
  }
}
</script>
