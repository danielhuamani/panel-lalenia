<template>
  <div>
    <b-modal v-model="show" id="zone-create-modal" size="xl" title="Crear Cuadrante de Cobertura" :scrollable="true" @hidden="hiddenModel">
      <b-container fluid>
          <div class="">
            <div class="form-check form-check-success mb-3">
              <input type="checkbox" id="formCheckcolor1" v-model="data.is_active" class="form-check-input">
              <label for="formCheckcolor1" class="form-check-label"> Activo </label>
            </div>
          </div>
          <div role="group" class="form-row form-group mb-3">
            <label for="email" class="col-12 col-form-label">Nombre</label>
            <div class="col">
              <b-form-input
                  id="input-1"
                  v-model="data.name"
                  type="text"
                  :class="{ 'is-invalid': $v.data.name.$error }"
                ></b-form-input>
                <div
                  v-if="$v.data.name.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.data.name.required">Este campo es obligatorio.</span>
                </div>
            </div>
          </div>
          <div role="group" class="form-row form-group mb-3">
            <label for="email" class="col-12 col-form-label">Color</label>
            <div class="col">
              <b-form-input
                  id="input-2"
                  v-model="data.colour"
                  type="color"
                  :class="{ 'is-invalid': $v.data.colour.$error }"
                ></b-form-input>
                <div
                  v-if="$v.data.colour.$error"
                  class="invalid-feedback"
                >
                  <span v-if="!$v.data.colour.required">Este campo es obligatorio.</span>
                </div>
            </div>
          </div>
          <div class="">
            <label for="" class="col-12 col-form-label">Zona de reparto</label>
            <div class="map" id="map-zone-create"></div>
            <div
                  v-if="$v.data.geometria.$error"
                  class="danger text-danger fz-10"
                >
              <span v-if="!$v.data.geometria.required">Este campo es obligatorio.</span>
            </div>
          </div>
      </b-container>
      <template #modal-footer>
        <b-button
          variant="secondary"
          class="float-right"
          @click="show=false"
        >
          Close
        </b-button>
        <b-button
          variant="success"
          class="float-right"
          @click.prevent="processInfo()"
          v-if="!loading"
        >
          Guardar
        </b-button>
        <button class="btn btn-lg btn-rounded btn-success" type="submit" disabled v-else>
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Guardando...
        </button>
  </template>
    </b-modal>
  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import LocalDriverService from "@/services/local-driver-service"
export default {
  name: "ZoneUpdate",
  props: {
    google: {
      type: Object,
      required: true,
    },
    local: {
      type: Object,
      required: true,
    },
    zoneDriver: {
        type: Object,
        required: true,
    },
    drivers: {
        type: Array,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    }
  },
  validations: {
    data: {
      name: { required },
      geometria: { required },
      colour: { required }
    }
  },
  data() {
    return {
      show: false,
      data: {
        id: null,
        name: "",
        geometria: null,
        colour: "",
        is_active: true
      },
      polygon: null,
      loading: false
    }
  },
  created() {
    Object.assign(this.data, this.zoneDriver);
  },
  mounted() {
    this.show = true
    this.$nextTick(() => {
        this.renderMap()
    });
  },
  methods: {
    renderMap() {
      if(this.local.location) {
        const lat = this.local.location.coordinates[1]
        const lng = this.local.location.coordinates[0]
        this.map = new this.google.maps.Map(document.getElementById("map-zone-create"), {
          zoom: 10,
          center: {
            lat: lat,
            lng: lng
          },
          mapTypeControl: false
        })
        this.map.setZoom(16)
        if(this.local.geometria) {
          this.createPolygon(this.local.geometria.coordinates[0], '#3ca868', 0.2, false)
        }
        this.createDriversArea()
        this.initialPolygon()
        this.draw()
      }
      
    },
    createDriversArea(){
      for (let index = 0; index < this.drivers.length; index++) {
        const element = this.drivers[index];
        if(this.zoneDriver.id != element.id) {
          this.createPolygon(element.geometria.coordinates[0], '#5c60d6', 0.2, false)
        }
      }
    },
    async initialPolygon() {
      const coordinates = this.zoneDriver.geometria.coordinates;
      if (this.polygon) {
        this.polygon.setMap(null);
      }
      const position = coordinates[0][0];
      this.polygon = this.createPolygon(coordinates[0], "#D94A43", 0.7 , true)
      var bounds = new this.google.maps.LatLngBounds();
      this.polygon.getPath().forEach(function (path) {
        bounds.extend(path);
      });
      var latlng = new this.google.maps.LatLng(position[1], position[0]);
      this.map.setCenter(latlng);
      this.map.setZoom(15);
    },
    createPolygon(coordinates, color, fillOpacity, editable) {
      const paths = coordinates.map((val) => {
        return {
          lat: val[1],
          lng: val[0]
        };
      });
      const bermudaTriangle = new this.google.maps.Polygon({
        paths: [paths],
        strokeColor: '#000',
        editable: editable,
        strokeOpacity: 0.3,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: fillOpacity
      })
      bermudaTriangle.setMap(this.map)
      bermudaTriangle.setVisible(true)
      return bermudaTriangle
    },
    draw() {
      const self = this;
      const drawingManager = new self.google.maps.drawing.DrawingManager({
        drawingMode: self.google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: self.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [self.google.maps.drawing.OverlayType.POLYGON]
        },
        markerOptions: {
          icon:
            "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
        },
        polygonOptions: {
          fillColor: "#D94A43",
          fillOpacity: 0.7,
          strokeWeight: 2,
          clickable: true,
          editable: true,
          zIndex: 1
        }
      });
      drawingManager.setMap(self.map);
      self.google.maps.event.addListener(
        drawingManager,
        "polygoncomplete",
        function (polygon) {
          if (self.polygon) {
            self.polygon.setMap(null);
          }
          drawingManager.setDrawingMode(null);
          if (self.polygon) {
            self.polygon.getPath().clear();
          }
          self.polygon = polygon;
        }
      );
    },
    processInfo() {
      const self = this
      if (this.polygon) {
        const dataLayer = new self.google.maps.Data();
        dataLayer.add(
          new self.google.maps.Data.Feature({
            geometry: new self.google.maps.Data.Polygon([
              self.polygon.getPath().getArray()
            ])
          })
        );
        dataLayer.toGeoJson((obj) => {
          self.data.geometria = {
            type: "Polygon",
            coordinates: obj.features[0].geometry.coordinates
          };
          this.putSubInfo();
        });
      } else {
        this.$v.$touch();
      }
    },
    hiddenModel() {
      this.$emit('close')
    },
    async putSubInfo() {
      this.$v.$touch();
      console.log("dasdsadsadss")
      if (this.$v.$invalid) {
        return;
      } else {
        this.loading = true;
        try {
          await LocalDriverService.update(
            this.zoneDriver.id,
            this.data
          );
          this.$store.dispatch("notification/setAlert", {
            is_alert: true,
            type: "S",
            msg: "Se actualizo correctamente"
          });
          this.loading = false;
          this.$emit('closeUpdate', {
            driver: this.data,
            index: this.index
          })
        } catch (error) {
          this.loading = false;
          console.log(error)
        }
      }
    }
  }
}
</script>