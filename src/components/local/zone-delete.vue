<template>
  <div>
    <b-modal v-model="show" id="zone-create-modal" size="xl" title="Eliminar Zona" :scrollable="true" @hidden="hiddenModel">
      <b-container fluid>
          <div class="row">
            <div class="col-12">
              Esta seguro de eliminar {{zoneDriver.name}} ?
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
          variant="danger"
          class="float-right"
          @click.prevent="deleteDriver()"
          v-if="!loading"
        >
          Si
        </b-button>
        <button class="btn btn-lg btn-rounded btn-danger" type="submit" disabled v-else>
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Guardando...
        </button>
  </template>
    </b-modal>
  </div>
</template>
<script>
import LocalDriverService from "@/services/local-driver-service"
export default {
  name: "ZoneDelete",
  props: {
    zoneDriver: {
        type: Object,
        required: true,
    }
  },
  data() {
    return {
      show: false,
      loading: false
    }
  },
  mounted() {
    this.show = true
  },
  methods: {
    async deleteDriver() {
      try {
          await LocalDriverService.delete(
            this.zoneDriver.id,
          );
          this.$store.dispatch("notification/setAlert", {
            is_alert: true,
            type: "S",
            msg: "Se elimino correctamente"
          });
          this.loading = false;
          this.$emit('closeDelete')
        } catch (error) {
          this.loading = false;
          console.log(error)
        }
    },
    hiddenModel() {
      this.$emit('close')
    },
  }
}
</script>