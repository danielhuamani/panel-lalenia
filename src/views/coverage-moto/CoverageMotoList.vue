
<template>
  <Layout>
    <PageHeader :title="title" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-sm-4"></div>
              <div class="col-sm-8">
                <div class="text-right">
                  <router-link
                    :to="{ name: 'coverage_moto_create' }"
                    class="btn btn-success mb-2 mr-2"
                  >
                    <i class="mdi mdi-plus mr-1"></i> CREAR CERTIFICADO
                  </router-link>
                </div>
              </div>
              <!-- end col-->
            </div>
            <div class="table-responsive mb-0">
              <table class="table table-centered">
                <thead class="thead-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Enlace</th>
                    <th>Activo</th>
                  </tr>
                </thead>
                <tbody v-if="!loading_table">
                  <tr v-for="result in results" :key="result.id">
                    <td>
                      <router-link
                        as="a"
                        :to="{
                          name: 'cert_update',
                          params: { id: result.id },
                        }"
                        class="font-weight-bold text-success"
                      >{{ result.nombre }}</router-link>
                    </td>
                    <td>
                      <ul class="list_price">
                        <li v-for="(product, index) in result.nombre_producto_producto" :key="'key-'+result.id+index">
                          <p>
                            {{product.tiempo_licencia}} {{getAnio(product.tiempo_licencia)}}
                            - S/ {{product.precio}} - US$ {{product.precio_dolares}}
                          </p>
                        </li>
                      </ul>
                    </td>
                    <td>
                      <a
                        v-if="result.url"
                        :href="'/pki/certificateRequest/'+result.url"
                        target="_blank"
                      >{{ result.url }}</a>
                      <a href="" @click.prevent="copyLink(result.url)" v-if="result.url" class="ml-2 fz-26"><i class="bx bx-link"></i></a>
                    </td>
                    <td>
                      <i class="fas fa-check text-success" v-if="result.is_active"></i>
                      <i class="fas fa-times text-danger" v-else></i>
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
    </div>
  </Layout>
</template>
<script>
import Layout from "@/layouts/main";
import appConfig from "@/app.config";
import PageHeader from "@/components/page-header";
import Page from "@/components/common/pages";

/**
 * Dashboard Component
 */
export default {
  page: {
    title: "Dashboard",
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
      title: "Cobertura",
      results: [],
      links: {},
      pages: {},
      loading_table: false
    }
  },
  mounted() {
    
  },
};
</script>
