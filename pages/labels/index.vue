<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col" style="display: flex; gap: 0.5rem">
          <input v-model="new_label_color" type="color" style="height: 100%" />
          <input v-model="new_label_name" type="text" style="flex-grow: 1" @keydown.enter="add_label()" />
          <button @click="add_label()" class="btn btn-primary">Add</button>
          <button @click="export_labels()" class="btn btn-secondary">Export</button>
        </div>
        <div style="border-bottom: 1px solid #999; width: 100%; margin: 1rem"></div>
        <div class="col">
          <div class="label-holder" v-for="(label, i) of labels" :key="label.name">
            <button class="btn btn-danger btn-sm" @click="labels.splice(i, 1)">
              <svg style="width: 1rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
            <span class="label" :style="{backgroundColor: `${label.color}`}">{{ label.name }}</span>
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
      new_label_color: "#0000cc",
      new_label_name: "",

      labels: [
        {
          name: 'Person',
          // color: '#d55',
          color: '#9FD8CB',
          meta: {
            editing: false,
          }
        },
        {
          name: 'Organisation',
          // color: '#5d5',
          color: '#CACFD6',
          meta: {
            editing: false,
          }
        },
      ]
    }
  },
  methods: {
    add_label() {
      if (this.new_label_color.length === 0 || this.new_label_name.length === 0)
        return;
      if (!/^[a-zA-Z]+$/.test(this.new_label_name))
        return;
      if (this.labels.some(x => x.name.toLocaleLowerCase() === this.new_label_name.toLocaleLowerCase()))
        return;

      this.labels.push({
        name: this.new_label_name,
        color: this.new_label_color
      })
    },

    export_labels() {
      const labels_export = {"labels": this.labels.map(x => {
        return {
          color: x.color,
          name: x.name
        }
      })}
      const labels_json = JSON.stringify(labels_export)

      const anchor_href = "data:text/json;charset=utf-8," + encodeURIComponent(labels_json);
      const anchor_el = document.createElement('a');
      anchor_el.setAttribute("href", anchor_href);
      anchor_el.setAttribute("download", "labels.json");
      anchor_el.click();
    }
  }
}
</script>

<style>
.label-holder {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.label {
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
}
</style>
