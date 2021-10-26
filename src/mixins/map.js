var mapMixin = {
  methods: {
    createPolygon(coordinates, color, fillOpacity, editable) {
      const paths = coordinates.map((val) => {
        return {
          lat: val[1],
          lng: val[0],
        }
      })
      const bermudaTriangle = new this.google.maps.Polygon({
        paths: [paths],
        strokeColor: "#000",
        editable: editable,
        strokeOpacity: 0.3,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: fillOpacity,
      })
      bermudaTriangle.setMap(this.map)
      bermudaTriangle.setVisible(true)
      return bermudaTriangle
    },
    createMaker(lat, lng) {
      const marker = new self.google.maps.Marker({
        map: this.map,
        draggable: false,
        animation: self.google.maps.Animation.DROP,
        position: new self.google.maps.LatLng(lat, lng),
      })
      const latLng = marker.getPosition()
      this.map.setCenter(latLng)
    },
  },
}
export default mapMixin
