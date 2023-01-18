<template>
    <main>
      <div class="container">
        <!-- <div class="row py-3">
          <div class="col text-center">
            <input type="file" accept=".txt, .json" id="input-file" @change="file_inputed"/>
          </div>
          <div class="col text-center">
            <button class="btn btn-primary" @click="download_task">Download Task</button>
          </div>
        </div> -->
      </div>
      <div id="label-studio"></div>
    </main>
</template>
  
<script>
  import LabelStudio from "@heartexlabs/label-studio";
  import "@heartexlabs/label-studio/build/static/css/main.css"
  
  
  export default {
    data() {
      return {
        labelStudio: null,
        annotations: [],
        predictions: [],
        text: "testing"
        // task: null
      }
    },
    methods: {
      
    },
    mounted() {
      this.labelStudio = new LabelStudio('label-studio', {
        config: `
        <View style="display: flex;">
          <View style="width: 150px; background: #f1f1f1; border-radius: 3px">
            <Filter name="fl" toName="ner" hotkey="shift+f" minlength="1" />
            <Labels style="padding-left: 2em; margin-right: 2em;" name="ner" toName="text">
              <Label value="Person" />
              <Label value="Organization" />
              <Label value="Service" />
            </Labels>
          </View>
  
          <View>
            <View style="height: 200px; overflow-y: auto">
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
  
            <View style="width: 100%; display: block">
              <Header value="Select span after creation to go next"/>
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
          annotations: this.annotations,
          predictions: this.predictions,
          id: 1,
          data: {
            text: this.text
          },
        },
        onLabelStudioLoad: function(LS) {
          var c = LS.annotationStore.addAnnotation({
            userGenerate: true
          });
          LS.annotationStore.selectAnnotation(c.id);
        }, 
        onSubmitAnnotation: function(LS, annotation) {
          // retrive an annotation 
          // console.log(annotation.serializeAnnotation())
          // console.log(annotation.serializeAnnotation())
          // axios.post('api/tasks/1/annotations', annotation.serializeAnnotation())
          // .then(response => {
          //   console.log(response);
          // })
          // .catch(error => {
          //   console.log(error);
          // });
        },
        onUpdateAnnotation: function(LS, annotation) {
          // retrive an annotation 
          // console.log(annotation.serializeAnnotation())
        }
      });
  
    }
  };
  </script>