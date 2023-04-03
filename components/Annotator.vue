<template>
  <div>
    <a id="download_ann" class="d-none"></a>
    <div id="label-studio"></div>
  </div>
</template>

<script>
  import LabelStudio from "@heartexlabs/label-studio";
  import "@heartexlabs/label-studio/build/static/css/main.css"

  export default {
    props: ["text", "initial_annotations"],
    data() {
      return {
        labelStudio: null,
        task: null,
        headers: {
              "Authorization": "Token ac9094e3ae134e545a4fbdd3b9edbbcebc4ee2ed",
              "Content-Type": "application/json",
          }
      }
    },
    methods: {
      get_annotations_from_ls_store() {
        const annotations = [];

        for (const annotation_ls of window.Htx.annotationStore.annotations) {
          annotations.push(annotation_ls.serializeAnnotation())
        }

        return annotations.map(a => {return {"result": a}});
      },
      download_annotation() {
        // const annotations_ser = [{result: annotations_ls.serializeAnnotation()}]
        const annotations_ser = this.get_annotations_from_ls_store()

        const ann = { text: this.text, annotations: annotations_ser}
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ann));
        const dlAnchorElem = document.getElementById('download_ann');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "annotation.json");
        dlAnchorElem.click();
      },
      initLS() {
        this.labelStudio = new LabelStudio('label-studio', {
            config: `
            <View style="display: flex;">
              <View style="width: 150px; background: #f1f1f1; border-radius: 3px">
                <Filter name="fl" toName="ner" hotkey="shift+f" minlength="1" />
                <Labels style="padding-left: 2em; margin-right: 2em;" name="ner" toName="text">
                  ${this.label_tags}
                </Labels>
              </View>

              <View>
                <View style="height: auto; overflow-y: auto; padding: 0 1em">
                  <Text name="text" value="$text" />
                </View>

              <Relations>
                <Relation value="Is A" />
                <Relation value="Has Function" />
                <Relation value="Involved In" />
                <Relation value="Related To" />
              </Relations>

                <View>
                  <Choices name="relevance" toName="text" perRegion="true">
                    <Choice value="Relevant" />
                    <Choice value="Non Relevant" />
                  </Choices>

                  <View visibleWhen="region-selected">
                    <Header value="Your confidence" />
                  </View>
                  <Rating name="confidence" toName="text" perRegion="true" />
                </View>
              </View>
            </View>
            `,
            interfaces: [
              "panel",
              "update",
              "submit",
              "skip",
              "controls",
              "infobar",
              "topbar",
              "instruction",
              "side-column",
              "annotations:history",
              "annotations:tabs",
              "annotations:menu",
              "annotations:current",
              "annotations:add-new",
              "annotations:delete",
              'annotations:view-all',
              "predictions:tabs",
              "predictions:menu",
              "auto-annotation",
              "edit-history",
            ],
            user: {
              pk: 1,
              firstName: "James",
              lastName: "Dean"
            },
            task: this.task ? this.task :
            {
              annotations: this.initial_annotations,
              // predictions: this.predictions,
              data: {
                text: this.text
              },
            },
            onLabelStudioLoad: (LS) => {
              if(this.task?.annotations?.length > 0 || this.initial_annotations?.length > 0) {
                LS.annotationStore.selectAnnotation(LS.annotationStore.annotations);
              }
              else {
                const c = LS.annotationStore.addAnnotation({
                  userGenerate: true
                });
                LS.annotationStore.selectAnnotation(c.id);
              }
            },
            onSubmitAnnotation: (LS, annotation) => {
              let ann = annotation
              console.log(ann)
              fetch(`http://localhost:8080/api/tasks/${task_id}/annotations/`, { method: "POST", headers: this.headers, body: JSON.stringify(ann) })
              .then(res => res.json())
              .then(res => { 
                console.log(res);
                this.download_annotation();
              })
              .catch(error => {
              console.log(error);
              })
            },
            onUpdateAnnotation: (LS, annotation) => {
              let ann = annotation
              console.log(ann)
              fetch(`http://localhost:8080/api/annotations/${ann.pk}`, { method: "PUT", headers: this.headers, body: JSON.stringify(ann) })
              .then(res => res.json())
              .then(res => { 
                console.log(res);
                this.download_annotation();
              })
              .catch(error => {
              console.log(error);
              })
            }
          });
      },
    },
    mounted() {
  
      const task_id = this.$route.query.task_id;
      if(task_id) {
        fetch(`http://localhost:8080/api/tasks/${task_id}`, { headers: this.headers })
        .then(res => res.json())
        .then(res => { 
          this.task = res
          console.log(res)
          this.label_tags = [];
          this.initLS()
        })
        .catch(error => {
         console.log(error);
        })

      } else {
        this.label_tags = this.$store.state.labels.map(l => `<Label value="${l.name}" background="${l.color}" />`).join("\n");
        this.initLS()
      }

    }
  };
  </script>
