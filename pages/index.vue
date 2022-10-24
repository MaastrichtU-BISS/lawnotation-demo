<template>
  <main><div id="label-studio"></div></main>
</template>

<script>

import LabelStudio from 'label-studio';
import 'label-studio/build/static/css/main.css';

export default {
  data() {
    return {
      LabelStudio,
      text: `We and our partners store and/or access information on a device, such as cookies and process personal data, such as unique identifiers and standard information sent by a device for personalised ads and content, ad and content measurement, and audience insights, as well as to develop and improve products. With your permission we and our partners may use precise geolocation data and identification through device scanning. You may click to consent to our and our partners’ processing as described above. Alternatively you may click to refuse to consent or access more detailed information and change your preferences before consenting. Please note that some processing of your personal data may not require your consent, but you have a right to object to such processing. Your preferences will apply to this website only. You can change your preferences at any time by returning to this site or visit our privacy policy.`
    }
  },
  mounted() {
    console.log('hola')
    this.LabelStudio = new LabelStudio('label-studio', {
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
        "controls",
        "side-column",
        "annotations:menu",
        "annotations:add-new",
        "annotations:delete",
        "predictions:menu"
      ],
      user: {
        pk: 1,
        firstName: "James",
        lastName: "Dean"
      },
      task: {
        annotations: [],
        predictions: [],
        id: 1,
        data: {
          text: this.text
        }
      },
      onLabelStudioLoad: function(LS) {
        var c = LS.annotationStore.addAnnotation({
          userGenerate: true
        });
        LS.annotationStore.selectAnnotation(c.id);
      }, 
      onSubmitAnnotation: function(LS, annotation) {
        // retrive an annotation 
        console.log(annotation.serializeAnnotation())
      },
      onUpdateAnnotation: function(LS, annotation) {
        // retrive an annotation 
        console.log(annotation.serializeAnnotation())
      }
    });
  }
};
</script>