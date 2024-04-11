<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>

    <VCard title="Update Data of this Blog">
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
                :rules="[twoMb].flat()"
              ></v-file-input>
            </VCol>
            <VCol cols="12" md="6">
              <VAvatar size="48">
                <VImg :src="fetch_photo" />
              </VAvatar>
            </VCol>
            <VCol cols="12" md="6">
              <VRadioGroup v-model="insertData.status" inline label="Status">
                <VRadio label="Active" :value="1" density="compact" />
                <VRadio label="In-Active" :value="0" density="compact" />
              </VRadioGroup>
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
      photo: "",
      fetch_photo: "",
      insertData: {
        title: "",
        by: "",
        description: "",
        facebook_link: "",
        x_link: "",
        instagram_link: "",
        status: "",
      },
      loader: false,
      paramsId: this.$route.params.id,
      errors: {},
      isAlertVisible: false,
      options: {
        placeholder: "Enter text",
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loader = true;
      await http
        .get("/blog/show/" + this.paramsId)
        .then((res) => {
          if (res.data.success) {
            const resData = res.data.data;
            const resDataTwo = res.data.data.newData;
            this.insertData.title = resData.title;
            this.insertData.by = resData.by;
            this.insertData.description = resData.description;
            this.insertData.facebook_link = resData.facebook_link;
            this.insertData.x_link = resData.x_link;
            this.insertData.instagram_link = resData.instagram_link;
            this.insertData.status = resData.status;
            this.fetch_photo = resData.photo;
          }
        })
        .catch((e) => {
          console.log(e);
        });
      this.loader = false;
    },
    async updateData() {
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
          .post("blog/update/" + this.paramsId, formData)
          .then((res) => {
            if (res.data.success) {
              this.fetchData();
              this.$toast.success(res.data.message);
              this.$router.push({
                path: "/blog/list/",
              });
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
