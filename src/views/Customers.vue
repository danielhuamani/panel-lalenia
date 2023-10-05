
<template>
  <Layout>
    <PageHeader :title="title" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div class="d-flex">
                <b-button  size="lg" variant="dark">Filtrar</b-button>
                <b-input-group prepend="$" append=".00">
                  <b-form-input></b-form-input>
                </b-input-group>
              </div>
              <div class="">
                <b-button  size="lg" variant="primary">Crear Cliente</b-button>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="table-responsive mb-0">
            <table class="table table-centered">
              <thead class="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Apellidos</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody v-if="!loading_table">
                <tr v-for="result in results" :key="result.id">
                  <td>
                    <router-link
                      as="a"
                      :to="{
                        name: 'local_detail',
                        params: { id: result.id },
                      }"
                      class="font-weight-bold"
                    >{{ result.first_name }}</router-link>
                  </td>
                  <td>
                    {{ result.last_name }}
                  </td>
                  <td>
                    {{ result.email }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="spinner_pagination" v-if="loading_table">
            <b-spinner class="m-2" variant="primary" role="status"></b-spinner>
          </div>
          <Page
            :links="links"
            :pages="pages"
            v-if="pages"
            @set-link="setLink"
            @set-page="setPage"
          ></Page>
        </div>
      </div>
    </div>
  </Layout>
</template>
<script>
import Layout from "@/layouts/main";
import appConfig from "@/app.config";
import PageHeader from "@/components/page-header";
import Page from "@/components/common/pages";
import LocalService from "@/services/local-service";
import CustomerData from "@/fake-data/customers";
/**
 * Dashboard Component
 */
export default {
  page: {
    title: "Clientes",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
    PageHeader,
    Page
  },
  data() {
    return {
      title: "Clientes",
      results: CustomerData,
      links: {},
      pages: {},
      loading_table: false
    }
  },
  created() {
  },
  methods: {
    setPage(page) {
        console.log(page)
    },
    setLink(link) {
        console.log(link)
    },
    getData() {
      LocalService.list().then(resp => {
        this.results = resp.data.results
        this.links = resp.data.links
        this.pages = resp.data.pages
      })
    }
  },
  mounted() {
    
  },
};
</script>
