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
        annotations: [],
        predictions: [],
        // task: null
      }
    },
    methods: {
      download_annotation(annotations) {
        var ann = { text: this.text, annotations: annotations}
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ann));
        var dlAnchorElem = document.getElementById('download_ann');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "annotation.json");
        dlAnchorElem.click();
      }
    },
    mounted() {
      console.log(this.initial_annotations)
      let label_tags = this.$store.state.labels.map(l => `<Label value="${l.name}" background="${l.color}" />`).join("\n");

      this.labelStudio = new LabelStudio('label-studio', {
        config: `
        <View style="display: flex;">
          <View style="width: 150px; background: #f1f1f1; border-radius: 3px">
            <Filter name="fl" toName="ner" hotkey="shift+f" minlength="1" />
            <Labels style="padding-left: 2em; margin-right: 2em;" name="ner" toName="text">
              ${label_tags}
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
        task: {
          annotations: this.initial_annotations,
          // predictions: this.predictions,
          // id: 1,
          data: {
            text: this.text
          },
        },
        onLabelStudioLoad: (LS) => {
          console.log(LS.annotationStore.annotations)
          // if(this.initial_annotations.length > 0) {
          //   // LS.annotationStore.selectAnnotation(LS.annotationStore.annotations);
          // }
          // else {
            var c = LS.annotationStore.addAnnotation({
              userGenerate: true
            });
            LS.annotationStore.selectAnnotation(c.id);
          // }
        },
        onSubmitAnnotation: (LS, annotation) => {
          // retrive an annotation
          this.download_annotation([annotation]);
          this.download_annotation(annotation.serializeAnnotation());
        },
        onUpdateAnnotation: (LS, annotation) => {
          // retrive an annotation
          this.download_annotation(annotation.serializeAnnotation());
        }
      });

    }
  };
  </script>
