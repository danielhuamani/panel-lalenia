<template>
  <div>
    <b-modal v-model="show" id="zone-create-modal" size="xl" title="Crear Zona" :scrollable="true" @hidden="hiddenModel">
      <b-container fluid>
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
  name: "ZoneCreate",
  props: {
    google: {
      type: Object,
      required: true,
    },
    local: {
      type: Object,
      required: true,
    }
  },
  validations: {
    data: {
      name: { required },
      geometria: { required }
    }
  },
  data() {
    return {
      show: false,
      data: {
        name: "",
        geometria: null
      },
      polygon: null,
      loading: false
    }
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
          this.createPolygon(this.local.geometria.coordinates[0])
        }
        this.draw()
      }
      
    },
    createPolygon(coordinates) {
      const paths = coordinates.map((val) => {
        return {
          lat: val[1],
          lng: val[0]
        };
      });
      const bermudaTriangle = new this.google.maps.Polygon({
        paths: [paths],
        strokeColor: '#000',
        strokeOpacity: 0.3,
        strokeWeight: 2,
        fillColor: '#3ca868',
        fillOpacity: 0.2
      })
      bermudaTriangle.setMap(this.map)
      bermudaTriangle.setVisible(true)
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
        console.log(this.polygon)
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
          this.postSubInfo();
        });
      } else {
        this.$v.$touch();
      }
    },
    hiddenModel() {
      this.$emit('close')
    },
    async postSubInfo() {
      this.$v.$touch();
      
      if (this.$v.$invalid) {
        return;
      } else {
        this.loading = true;
        try {
          await LocalDriverService.create(
            this.$route.params.id,
            this.data
          );
          this.$store.dispatch("notification/setAlert", {
            is_alert: true,
            type: "S",
            msg: "Se creo correctamente"
          });
          this.loading = false;
          this.$emit('closeUpdate')
        } catch (error) {
          this.loading = false;
          console.log(error)
        }
      }
    }
  }
}
</script>