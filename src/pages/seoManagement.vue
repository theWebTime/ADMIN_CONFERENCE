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
          <h3>Update Seo Management</h3>
          <br />
          <VRow>
            <VCol cols="12" md="6">
              <v-file-input
                accept="image/*"
                v-model="og_image"
                label="Image"
                ref="file"
              ></v-file-input>
            </VCol>
            <VCol cols="12" md="6">
              <VAvatar size="48">
                <VImg :src="fetch_photo" />
              </VAvatar>
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField v-model="insertData.viewport" label="Viewport" />
            </VCol>
            <VCol cols="12" md="4">
              <v-textarea
                v-model="insertData.description"
                label="Description"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField v-model="insertData.keyword" label="Keyword" />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField v-model="insertData.robots" label="Robots" />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.contact"
                type="number"
                label="Contact"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.distribution"
                label="Distribution"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField v-model="insertData.rating" label="Rating" />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.geo_placement1"
                label="Geo placement 1"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.geo_placement2"
                label="Geo placement 2"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField v-model="insertData.author" label="Author" />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField v-model="insertData.og_title" label="OG Title" />
            </VCol>
            <VCol cols="12" md="4">
              <v-textarea
                v-model="insertData.og_description"
                label="OG Description"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.og_email"
                :rules="[email].flat()"
                label="OG Email"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.og_phone"
                type="phone"
                label="OG Phone"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField v-model="insertData.og_url" label="OG URL" />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.twitter_card"
                label="Twitter Card"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.twitter_side"
                label="Twitter Side"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.twitter_creator"
                label="Twitter Creator"
              />
            </VCol>
            <VCol cols="12" md="4">
              <AppTextField
                v-model="insertData.twitter_title"
                label="Twitter Title"
              />
            </VCol>
            <VCol cols="12" md="4">
              <v-textarea
                v-model="insertData.twitter_description"
                label="Twitter Description"
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
      email: [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email must be valid",
      ],
      og_image: "",
      fetch_photo: "",
      insertData: {
        viewport: "",
        description: "",
        keyword: "",
        robots: "",
        contact: "",
        distribution: "",
        rating: "",
        geo_placement1: "",
        geo_placement2: "",
        author: "",
        og_title: "",
        og_description: "",
        og_image: "",
        og_email: "",
        og_phone: "",
        og_url: "",
        twitter_card: "",
        twitter_side: "",
        twitter_creator: "",
        twitter_title: "",
        twitter_description: "",
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
        .get("/seo-management-show")
        .then((res) => {
          if (res.data.success) {
            this.insertData.viewport = res.data.data.viewport;
            this.insertData.description = res.data.data.description;
            this.insertData.keyword = res.data.data.keyword;
            this.insertData.robots = res.data.data.robots;
            this.insertData.contact = res.data.data.contact;
            this.insertData.distribution = res.data.data.distribution;
            this.insertData.rating = res.data.data.rating;
            this.insertData.geo_placement1 = res.data.data.geo_placement1;
            this.insertData.geo_placement2 = res.data.data.geo_placement2;
            this.insertData.author = res.data.data.author;
            this.insertData.og_title = res.data.data.og_title;
            this.insertData.og_description = res.data.data.og_description;
            this.insertData.og_email = res.data.data.og_email;
            this.insertData.og_phone = res.data.data.og_phone;
            this.insertData.og_url = res.data.data.og_url;
            this.insertData.twitter_card = res.data.data.twitter_card;
            this.insertData.twitter_side = res.data.data.twitter_side;
            this.insertData.twitter_creator = res.data.data.twitter_creator;
            this.insertData.twitter_title = res.data.data.twitter_title;
            this.insertData.twitter_description =
              res.data.data.twitter_description;
            this.fetch_photo = res.data.data.og_image;
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
        const formData = new FormData();
        if (this.og_image) {
          const imageData = this.$refs.file.files[0];
          formData.append("og_image", imageData);
        } else {
          formData.append("og_image", "");
        }
        for (let x in this.insertData) {
          formData.append(x, this.insertData[x]);
        }
        this.loader = true;
        http
          .post("seo-management/store", formData)
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
