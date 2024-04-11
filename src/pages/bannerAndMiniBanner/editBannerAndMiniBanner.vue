<template>
  <div>
    <GlobalBreadCrumbsVue></GlobalBreadCrumbsVue>

    <VCard title="Update Data of this Banner Or Mini Banner">
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
            <VCol cols="12" md="6">
              <VRadioGroup v-model="insertData.is_banner" inline label="Status">
                <VRadio label="Banner" :value="1" density="compact" />
                <VRadio label="Mini Banner" :value="0" density="compact" />
              </VRadioGroup>
            </VCol>
            <VCol cols="12" md="6">
              <v-file-input
                accept="image/*"
                v-model="image"
                label="Image"
                ref="file"
              ></v-file-input>
            </VCol>
            <VCol cols="12" md="6">
              <VAvatar size="48">
                <VImg :src="fetch_photo" />
              </VAvatar>
            </VCol>
            <VCol cols="12" md="6">
              <AppTextField
                :rules="[globalRequire, nameMin].flat()"
                v-model="insertData.title"
                label="Title"
              />
            </VCol>
            <VCol cols="12" md="6">
              <v-textarea
                v-model="insertData.description"
                :rules="[globalRequire, nameMin].flat()"
                label="Description"
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
import http from "../../http-common";
export default {
  components: {
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
      image: "",
      fetch_photo: "",
      insertData: {
        is_banner: "",
        title: "",
        description: "",
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
    async fetchData() {
      this.loader = true;
      await http
        .get("/banner-mini-banner/show/" + this.paramsId)
        .then((res) => {
          if (res.data.success) {
            const resData = res.data.data;
            this.insertData.is_banner = resData.is_banner;
            this.insertData.title = resData.title;
            this.insertData.description = resData.description;
            this.fetch_photo = resData.image;
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
        if (this.image) {
          const imageData = this.$refs.file.files[0];
          formData.append("image", imageData);
        } else {
          formData.append("image", "");
        }
        for (let x in this.insertData) {
          formData.append(x, this.insertData[x]);
        }
        this.loader = true;
        http
          .post("banner-mini-banner/update/" + this.paramsId, formData)
          .then((res) => {
            if (res.data.success) {
              this.fetchData();
              this.$toast.success(res.data.message);
              this.$router.push({
                path: "/bannerAndMiniBanner/list/",
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
