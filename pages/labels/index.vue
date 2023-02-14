<template>
  <main>
    <div class="container">
      <div class="row">
        <div class="col" style="display: flex; flex-direction: column; gap: 0.25rem">
          <input type="text" v-model="label_collection.name" />
          <textarea
            :value="label_collection.description"
            @input="label_collection.description = $event.target.value"></textarea>
        </div>
        <div style="border-bottom: 1px solid #999; width: 100%; margin: 1rem"></div>
        <div class="col" style="display: flex;  gap: 0.5rem">
          <input v-model="new_label.color" type="color" style="height: 100%" />
          <input v-model="new_label.name" type="text" style="flex-grow: 1" @keydown.enter="add_label()" />
          <button @click="add_label()" class="btn btn-primary">Add</button>
          <button @click="export_label_collection()" class="btn btn-secondary">Export</button>
          <button @click="click_import_label_collection()" class="btn btn-secondary">Import</button>
          <input type="file" style="display: none;" @change="import_labels_file_changed" id="import_file_holder" />
        </div>
        <div style="border-bottom: 1px solid #999; width: 100%; margin: 1rem"></div>
        <div class="col">
          <div class="label-holder" v-for="(label, i) of label_collection.labels" :key="label.name">
            <button class="btn btn-danger btn-sm" @click="label_collection.labels.splice(i, 1)">
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
function get_label_default() {
  const r = Math.floor(Math.random() * 180 + 50)
  const b = Math.floor(Math.random() * 180 + 50)
  const g = Math.floor(Math.random() * 180 + 50)

  return {
    name: "",
    color: `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`,
    meta: {
      editing: false
    }
  };
}

export default {
  data() {
    return {
      new_label: get_label_default(),

      label_collection: {
        name: 'Default Label Collection',
        description: 'This is the description of the default label collection, containing labels for a specific or global use case, as the person configuring desires.',
        labels: [
          {
            name: 'Person',
            color: '#517664',
          },
          {
            name: 'Organisation',
            color: '#9FD8CB',
          },
          {
            name: 'Serivce',
            color: '#CACFD6',
          },
        ]
      }
    }
  },
  methods: {
    click_import_label_collection() {
      const el = document.getElementById("import_file_holder")
      if (el)
        el.click();
    },

    import_labels_file_changed(event) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if ((ev.target?.result ?? false) && typeof ev.target?.result === 'string') {
          try {
            const import_raw = ev.target?.result;
            const import_label_collection = JSON.parse(import_raw)['label_collection']
            this.import_label_collection(import_label_collection)
          } catch {
            // TODO: toast/show error
            alert("No label collection found in file")
          }
        }
      };
      const event_target = event.target;
      if (event_target.files != null) {
          reader.readAsText(event_target.files[0]);
      }
    },
    import_label_collection(label_collection) {
      this.label_collection = label_collection;
      // this.$set(this.label_collection, label_collection)
      console.log("imported:", label_collection)
    },
    export_label_collection() {
      // const labels_export = {"labels": this.label_collection.labels.map(x => {
      //   return {
      //     color: x.color,
      //     name: x.name
      //   }
      // })}
      const labels_export = {"label_collection": this.label_collection};
      const labels_json = JSON.stringify(labels_export)

      const anchor_href = "data:text/json;charset=utf-8," + encodeURIComponent(labels_json);
      const anchor_el = document.createElement('a');
      anchor_el.setAttribute("href", anchor_href);
      anchor_el.setAttribute("download", "labels.json");
      anchor_el.click();
    },


    validate_new_label() {
      if (!/^\#[a-zA-Z0-9]{6}$/.test(this.new_label.color))
        throw new Error("Invalid label color");
      if (!/^[a-zA-Z]+$/.test(this.new_label.name))
        throw new Error("Invalid label name");
      if (this.label_collection.labels.some(x => x.name.toLocaleLowerCase() === this.new_label.name.toLocaleLowerCase()))
        throw new Error("A label with this color already exists");
    },
    add_label() {
      try {
        this.validate_new_label()

        this.label_collection.labels.push({
          name: this.new_label.name,
          color: this.new_label.color
        });

        // this.new_label = label_default;
        // this.$set(this.new_label, label_default)
        // alert(label_default.name)
        this.new_label = get_label_default();
      } catch(error) {
        alert(error.message)
      }
    },

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
