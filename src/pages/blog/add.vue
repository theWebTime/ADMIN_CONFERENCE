<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
    <VCard title="Add Blog">
      <VAlert
        v-model="isAlertVisible"
        closable
        close-label="Close Alert"
        color="error"
      >
        <ul v-for="(value, key) in errors" :key="key">
          <li v-for="(value1, key1) in value" :key="key1">-> {{ value1 }}</li>
        </ul>
        {{ value }}
      </VAlert>
      <VForm ref="formSubmit">
        <VCardText>
          <VRow>
            <VCol cols="12" md="4">
              <AppTextField
                :rules="[globalRequire, nameMin].flat()"
                v-model="insertData.title"
                label="Title"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField v-model="insertData.by" label="By" />
            </VCol>
            <VCol cols="12" md="4" class="editor-layout">
              <QuillEditor
                theme="snow"
                v-model:content="insertData.description"
                contentType="html"
                label="Description"
                :options="options"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.facebook_link"
                label="Facebook Link"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField v-model="insertData.x_link" label="X Link" />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.instagram_link"
                label="Instagram Link"
              />
            </VCol>
            <VCol cols="12" md="6">
              <v-file-input
                accept="image/*"
                v-model="photo"
                label="Image"
                ref="file"
                :rules="[globalRequire, twoMb].flat()"
              ></v-file-input>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn @click="saveData"> Save </VBtn>
        </VCardText>
      </VForm>
    </VCard>
    <!-- global loader modal -->
    <VDialog v-model="loader" width="300">
      <VCard color="primary" width="300">
        <VCardText class="pt-3">
          loading.........
          <VProgressLinear indeterminate class="mb-0" />
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
<script>
import GlobalBreadCrumbsVue from "@/components/common/GlobalBreadCrumbs.vue";
import http from "../../http-common";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
export default {
  components: {
    QuillEditor,
    GlobalBreadCrumbsVue,
  },
  data() {
    return {
      globalRequire: [
        (value) => {
          if (value) return true;
          return "Required.";
        },
      ],
      nameMin: [
        (value) => {
          if (value?.length >= 3) return true;
          return "Must be at least 3 characters.";
        },
      ],
      options: {
        placeholder: "Enter text",
      },
      photo: "",
      insertData: {
        title: "",
        by: "",
        description: "",
        facebook_link: "",
        x_link: "",
        instagram_link: "",
        linkedin_link: "",
      },
      loader: false,
      errors: {},
      isAlertVisible: false,
    };
  },
  methods: {
    async saveData() {
      const checkValidation = await this.$refs.formSubmit.validate();
      if (checkValidation.valid) {
        const formData = new FormData();
        if (this.photo) {
          const imageData = this.$refs.file.files[0];
          formData.append("photo", imageData);
        } else {
          formData.append("photo", "");
        }
        for (let x in this.insertData) {
          formData.append(x, this.insertData[x]);
        }
        this.loader = true;
        http
          .post("/blog/store", formData)
          .then((res) => {
            if (res.data.success) {
              this.$router.push({
                path: "/blog/list/",
              });
              this.$toast.success(res.data.message);
              this.isAlertVisible = false;
            } else {
              this.$toast.error(res.data.message);
              this.errors = res.data.data;
              this.isAlertVisible = true;
            }
            this.loader = false;
          })
          .catch((e) => {
            this.loader = false;
            console.log(e);
          });
      }
    },
  },
};
</script>
<style scoped>
.editor-layout {
  width: 100%;
  height: 100%;
}
</style>
