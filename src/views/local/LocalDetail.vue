
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
                  <div class="col-lg-10 col-sm-10 col-12">
                    <div class="map" id="map"></div>
                  </div>
              </div>
              
            </form>
          </div>
        </div>
        <h4 class="card-title mb-4 mt-4">Cuadrante de Cobertura <a href="" @click.prevent="openModalCreate()"  class="text-success">(Crear <i class="bx bx-edit"></i>)</a> </h4>
        <div class="row">
          <!-- <div class="col-3">
            <div class="zone ">
              <a href="#" class="text-success stretched-link" @click.prevent="openModalCreate()">Crear Zona</a>
            </div>
          </div> -->
          <div class="col-md-3 col-12 mb-4" v-for="(driver, index) in drivers" :key="driver.id">
            <div class="zone ">
              <div @click="openModalUpdate(driver, index)" class="mb-3">
                <p class="text-success mb-1" >{{driver.name}} 
                  (<i class="fas fa-check text-success" v-if="driver.is_active"></i>
                  <i class="fas fa-times text-danger" v-else></i>) 
                
                </p>
                <span class="zone__colour" :style="{'background': driver.colour}">

                </span>
                
              </div>
              <div class="text-danger mt-1" @click="openModalDelete(driver)">Eliminar <i class="bx bx-trash"></i></div>
            </div>
          </div>
          
        </div>
        <div class="row">
          <ZoneCoverage v-if="loadCoverage && google" :google="google" :local="data" :drivers="drivers"></ZoneCoverage>
        </div>
      </div>
      <ZoneCreateModal v-if="openModalZoneCreate" :google="google" :local="data" @close="openModalZoneCreate = false" :drivers="drivers" @closeCreate="closeCreate"></ZoneCreateModal>
      <ZoneUpdateModal v-if="openModalZoneUpdate" :google="google" :local="data" :zone-driver="zoneDriver" :index="zoneDriverIndex" :drivers="drivers" @close="openModalZoneUpdate = false" @closeUpdate="closeUpdate"></ZoneUpdateModal>
      <ZoneDeleteModal v-if="openModalZoneDelete" :zone-driver="zoneDriver" @close="openModalZoneDelete = false" @closeDelete="reload()"></ZoneDeleteModal>
    </div>
  </Layout>
</template>
<script>
import Layout from "@/layouts/main";
import appConfig from "@/app.config";
import PageHeader from "@/components/page-header";
import LocalService from "@/services/local-service";
import LocalDriverService from "@/services/local-driver-service";
import { Loader } from '@googlemaps/js-api-loader';
import ZoneCreateModal from '@/components/local/zone-create';
import ZoneUpdateModal from '@/components/local/zone-update';
import ZoneDeleteModal from '@/components/local/zone-delete';
import ZoneCoverage from '@/components/local/zone-coverage';
import MapMixin from '@/mixins/map';
/**
 * Dashboard Component
 */
const GOOGLE_APIKEY = process.env.VUE_APP_GOOGLE_APIKEY
export default {
  name: "LocalDetail",
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
    ZoneCreateModal,
    ZoneUpdateModal,
    ZoneDeleteModal,
    ZoneCoverage
  },
  mixins: [MapMixin],
  data() {
    return {
      title: "Local Detalle",
      data: {
        is_active: false,
        name: "",
        location: null
      },
      google: null,
      map: null,
      openModalZoneCreate: false,
      openModalZoneUpdate: false,
      openModalZoneDelete: false,
      drivers: [],
      zoneDriver: null,
      zoneDriverIndex: null,
      loadCoverage: false
    }
  },
  created() {
    this.getDrivers()
  },
  mounted() {
    const loader = new Loader({
      apiKey: GOOGLE_APIKEY,
      version: 3,
      libraries: ["places", "drawing"]
    });
    loader
      .load()
        .then((google) => {
          this.google = google;
          const element = document.getElementById("map")
          this.map = new this.google.maps.Map(element, {
            zoom: 13,
            center: {
              lng: -77.0653445,
              lat: -12.031236
            },
            mapTypeControl: false
          });
          this.map.setZoom(13);
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
        this.loadCoverage = true
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
        this.createMaker(lat, lng) 
        if(this.data.geometria) {
          this.createPolygon(this.data.geometria.coordinates[0], '#3ca868', 0.3, false)
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
    openModalCreate() {
      this.openModalZoneCreate = true
    },
    openModalDelete(driver) {
      console.log(driver, "open delete")
      this.openModalZoneDelete = true
      this.zoneDriver = driver
    },
    openModalUpdate(driver, index) {
      console.log('update')
      this.openModalZoneUpdate = true
      this.zoneDriver = driver
      this.zoneDriverIndex = index
    },
    async reload() {
      this.openModalZoneCreate = false
      this.openModalZoneDelete = false
      // this.loadCoverage = false
      await this.getDrivers()
      // this.$nextTick(() => {
        // this.loadCoverage = true

      // });
    },
    async getDrivers() {
      const response = await LocalDriverService.list(this.$route.params.id)
      this.drivers = response.data 
    },
    closeUpdate(data) {
      let driver = data.driver
      let index = data.index
      // this.drivers[index] = driver
      this.$set(this.drivers, index, driver)
      console.log('driver', this.drivers, driver)
      this.openModalZoneUpdate = false
      this.zoneDriver = null
      this.zoneDriverIndex = null
    },
    closeCreate(data) {
      let driver = data.driver
      this.drivers.push(driver)
      this.openModalZoneCreate = false
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
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 100px;
    &__colour{
      display:block;
      border-radius: 6px;
      height: 10px;
      width: 60px;
      margin: auto;
    }
  }
</style>