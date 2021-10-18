
<template>
  <Layout>
    <PageHeader :title="title" go-back="local_list"/>
    <div class="card">
      <div class="card-body">
        <h4 class="card-title mb-4">Información</h4>
        <div class="row">
          <div class="col-12">
            <form class="form-horizontal" role="form">
              <div id="example-email" role="group" class="form-row form-group mb-3">
                  <label id="example-email__BV_label_" for="email" class="col-sm-2 col-lg-2  col-12 col-form-label">Activo</label><div class="col">
                  <i class="fas fa-check text-success" v-if="data.is_active"></i>
                  <i class="fas fa-times text-danger" v-else></i>
                </div>
              </div>
              <div role="group" class="form-row form-group mb-3">
                  <label for="email" class="col-sm-2 col-lg-2  col-12 col-form-label">Nombre</label><div class="col">
                  <b-form-input
                    id="input-1"
                    v-model="data.name"
                    readonly="readonly"
                    type="text"
                  ></b-form-input>
                </div>
              </div>
              <div role="group" class="form-row form-group mb-3">
                  <label id="example-email__BV_label_" for="email" class="col-sm-2 col-lg-2  col-12 col-form-label">Direccion</label><div class="col">
                  <b-form-input
                    id="input-2"
                    v-model="data.address"
                    readonly="readonly"
                    type="text"
                  ></b-form-input>
                </div>
              </div>
              <div role="group" class="form-row form-group mb-3">
                  <label id="" for="email" class="col-sm-2 col-lg-2  col-12 col-form-label">Ubicación</label>
                  <div class="col">
                    <div class="map" id="map"></div>
                  </div>
              </div>
            </form>
          </div>
        </div>
        <h4 class="card-title mb-4 mt-4">Zonas Reparto</h4>
        <div class="row">
          <div class="col-3">
            <div class="zone ">
              <a href="#" class="text-success stretched-link" @click.prevent="openModalCreate()">Crear Zona</a>
            </div>
          </div>
        </div>
      </div>
      <b-modal id="modal-xl" size="xl" title="Crear Zona">Hello Extra Large Modal!</b-modal>
    </div>
  </Layout>
</template>
<script>
import Layout from "@/layouts/main";
import appConfig from "@/app.config";
import PageHeader from "@/components/page-header";
import LocalService from "@/services/local-service";
import { Loader } from '@googlemaps/js-api-loader';

/**
 * Dashboard Component
 */
const GOOGLE_APIKEY = process.env.VUE_APP_GOOGLE_APIKEY
export default {
  page: {
    title: "Local Detalle",
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
      title: "Local Detalle",
      data: {
        is_active: false,
        name: "",
        location: null
      },
      google: null,
      map: null
    }
  },
  created() {
    
  },
  mounted() {
    const loader = new Loader({
      apiKey: GOOGLE_APIKEY,
      version: 3,
      libraries: ["places"]
    });
    loader
      .load()
      .then((google) => {
        this.google = google
        this.getData()
      })
      .catch(e => {
        console.log(e)
      });
  },
  methods: {
    getData() {
      LocalService.detail(this.$route.params.id).then(resp => {
        this.data = resp.data
        this.initMap()
      })
      
    },
    initMap() {
      this.renderMap()
    },
    renderMap() {
      if(this.data.location) {
        const lat = this.data.location.coordinates[1]
        const lng = this.data.location.coordinates[0]
        this.map = new this.google.maps.Map(document.getElementById("map"), {
          zoom: 10,
          center: {
            lat: lat,
            lng: lng
          },
          mapTypeControl: false
        })
        this.map.setZoom(16)
        this.createMaker(lat, lng) 
        if(this.data.geometria) {
          this.createPolygon(this.data.geometria.coordinates[0])
        }
      }
      
    },
    createMaker(lat, lng) {
      const marker = new self.google.maps.Marker({
        map: this.map,
        draggable: false,
        animation: self.google.maps.Animation.DROP,
        position: new self.google.maps.LatLng(
          lat,
          lng
        )
      })
      const latLng = marker.getPosition()
      this.map.setCenter(latLng)
    },
    createPolygon(coordinates) {
      const polygon = []
      for (let j = coordinates.length - 1; j >= 0; j--){
        polygon.push({
          lat: coordinates[j][1],
          lng: coordinates[j][0]
        })
      }
      console.log(polygon)
      const bermudaTriangle = new this.google.maps.Polygon({
        paths: polygon,
        strokeColor: '#000',
        strokeOpacity: 0.3,
        strokeWeight: 2,
        fillColor: '#3ca868',
        fillOpacity: 0.2
      })
      bermudaTriangle.setMap(this.map)
      bermudaTriangle.setVisible(true)
    },
    openModalCreate() {
      this.$bvModal.show('modal-xl')
    }
  }
};
</script>
<style lang="scss">
  .map{
    width: 100%;
    height: 400px;
  }
  .zone{
    border: 1px dashed #343a40;
    padding: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100px;
  }
</style>