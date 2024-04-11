<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>
    <br />
    <VDivider />
    <VCard>
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
          <h3>Update School Owner Detail</h3>
          <br />
          <VRow>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="insertData.title1"
                :rules="[globalRequire].flat()"
                label="Title 1"
              />
            </VCol>
            <VCol cols="12" md="6" class="editor-layout">
              <QuillEditor
                theme="snow"
                v-model:content="insertData.description1"
                contentType="html"
                label="Description 1"
                :options="options"
              />
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                v-model="insertData.title2"
                :rules="[globalRequire].flat()"
                label="Title 2"
              />
            </VCol>
            <VCol cols="12" md="6" class="editor-layout">
              <QuillEditor
                theme="snow"
                v-model:content="insertData.description2"
                contentType="html"
                label="Description 1"
                :options="options"
              />
            </VCol>
          </VRow>
        </VCardText>
        <VCardText class="d-flex justify-end flex-wrap gap-3">
          <VBtn @click="updateData"> Update </VBtn>
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
import http from "../http-common";
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
      email: [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email must be valid",
      ],
      options: {
        placeholder: "Enter text",
      },
      insertData: {
        title1: "",
        description1: "",
        title2: "",
        description2: "",
      },
      loader: false,
      paramsId: this.$route.params.id,
      errors: {},
      isAlertVisible: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loader = true;
      http
        .get("/school-owner-detail-show")
        .then((res) => {
          if (res.data.success) {
            this.insertData.title1 = res.data.data.title1;
            this.insertData.description1 = res.data.data.description1;
            this.insertData.title2 = res.data.data.title2;
            this.insertData.description2 = res.data.data.description2;
          }
          this.loader = false;
        })
        .catch((e) => {
          this.loader = false;
          console.log(e);
        });
    },
    async updateData() {
      const checkValidation = await this.$refs.formSubmit.validate();
      if (checkValidation.valid) {
        this.loader = true;
        http
          .post("school-owner-detail/store", this.insertData)
          .then((res) => {
            if (res.data.success) {
              this.fetchData();
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
