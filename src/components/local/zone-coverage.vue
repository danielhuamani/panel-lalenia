<template>
  <div role="group" class="form-row form-group mb-3">
    <label id="" for="email" class="col-sm-2 col-lg-2  col-12 col-form-label">Cuadrantes</label>
    <div class="col">
      <div class="map" id="map-zone-coverage"></div>
    </div>
  </div>
</template>
<script>
import MapMixin from '@/mixins/map';
export default {
  name: "Coverage",
  mixins: [MapMixin],
  props: {
    google: {
      type: Object,
      required: true,
    },
    local: {
      type: Object,
      required: true,
    },
    drivers: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      map: null,
      polygons: {}
    }
  },
  watch: {
    'drivers': function(newVal, oldVal) {
      console.log('Prop changed: ', newVal, ' | wassss: ', oldVal)
      this.cleanAreas()
      this.createDriversArea() 
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
    }
  },
  mounted() {
    console.log('mounted')
    this.renderMap()
  },
  methods: {
    renderMap() {
      console.log('renderMap', this.local)
      if(this.local.location) {
        const lat = this.local.location.coordinates[1]
        const lng = this.local.location.coordinates[0]
        this.map = new this.google.maps.Map(document.getElementById("map-zone-coverage"), {
          zoom: 10,
          center: {
            lat: lat,
            lng: lng
          },
          mapTypeControl: false
        })
        this.map.setZoom(14 )
        this.createMaker(lat, lng) 
        if(this.local.geometria) {
          
          this.createPolygon(this.local.geometria.coordinates[0], '#3ca868', 0.2, false)
          this.createDriversArea()
        }
      }
    },
    cleanAreas() {
      const self = this
      console.log('dsadsa')
      for (let key in self.polygons) {
        const polygon = self.polygons[key];
        console.log(polygon, 'polygon')
        polygon.setMap(null)
      }
      self.polygons = {}
    },
    createDriversArea(){
      const self = this
      for (let index = 0; index < this.drivers.length; index++) {
        const element = this.drivers[index];
        let colour = element.colour || "#5c60d6"
        self.polygons[element.id] = this.createPolygon(element.geometria.coordinates[0], colour, 0.7 , false)
      
      }
    },
  }
}
</script>