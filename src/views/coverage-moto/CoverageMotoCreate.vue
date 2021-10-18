
<template>
  <Layout>
    <PageHeader :title="title" />
    <div class="card">
      <div class="card-body">
        <h4 class="card-title mb-4">Información</h4>
        <div class="row">
          <div class="col-12">
            <form class="form-horizontal" role="form">
              <div id="example-email" role="group" class="form-row form-group mb-3">
                  <label id="example-email__BV_label_" for="email" class="col-sm-2 col-lg-2  col-12 col-form-label">Activo</label><div class="col">
                  <b-form-checkbox switch  v-model="data.is_active"></b-form-checkbox>
                </div>
              </div>
              <div role="group" class="form-row form-group mb-3">
                  <label id="example-email__BV_label_" for="email" class="col-sm-2 col-lg-2  col-12 col-form-label">Nombre</label><div class="col">
                  <input id="email" type="text" class="form-control"><!----><!----><!---->
                </div>
              </div>
            </form>
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

/**
 * Dashboard Component
 */
export default {
  page: {
    title: "Cobertura Crear",
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
  },
  data() {
    return {
      title: "Cobertura Crear",
      data: {
        is_active: true
      }
    };
  },
  mounted() {
    setTimeout(() => {
      this.showModal = true;
    }, 1500);
  },
};
</script>
