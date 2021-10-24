<template>
  <div>
    <b-alert
      :show="showCountMsgSuccess"
      dismissible
      variant="success"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
      class="alert-global-msg"
      v-if="alert.type == 'S'"
    >
      <p>{{alert.msg || 'Se guardo correctamente.'}}</p>
      <b-progress variant="success" max="10" :value="showCountMsgSuccess" height="4px"></b-progress>
    </b-alert>
    <b-alert
      :show="showCountMsgError"
      dismissible
      variant="danger"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChangedError"
      class="alert-global-msg"
      v-if="alert.type == 'D'"
    >
      <p>{{alert.msg || 'Por favor verifique la informacion en los campos resaltados.'}}</p>
      <b-progress variant="danger" max="10" :value="showCountMsgError" height="4px"></b-progress>
    </b-alert>
  </div>
</template>
<script>
export default {
  name: "alert-msg",
  data() {
    return {
      showCountMsgError: 0,
      showCountMsgSuccess: 0,
      secsMsg: 10
    };
  },
  props: ["alert"],
  created() {
    if (this.alert.type == "S") {
      this.showCountMsgSuccess = this.secsMsg;
    }
    if (this.alert.type == "D") {
      this.showCountMsgError = this.secsMsg;
    }
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.showCountMsgSuccess = dismissCountDown;
      if (dismissCountDown === 0) {
        this.$store.dispatch("notification/setAlert", {
          is_alert: false,
          type: "",
          msg: ""
        });
      }
    },
    countDownChangedError(dismissCountDown) {
      this.showCountMsgError = dismissCountDown;
      if (dismissCountDown === 0) {
        this.$store.dispatch("notification/setAlert", {
          is_alert: false,
          type: "",
          msg: ""
        });
      }
    }
  }
};
</script>