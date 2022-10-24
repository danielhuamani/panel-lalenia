<template>
  <div class="card">
    <div class="card-body">
      <h4 class="card-title mb-4">Ranking de productos</h4>
      <!-- Spline Area chart -->
      <div class="row min-height-dasboard">
        <div class="col-md-6">
          <div class="form-group form-group-dashboard">
            <label for>Desde</label>
            <date-picker
              v-model="filter.from"
              type="month"
              lang="es"
              format="M/YYYY"
              value-type="format"
              :clearable="false"
              class="form-control-dashboard"
              @change="getData"
            >
              <template v-slot:icon-calendar></template>
            </date-picker>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group form-group-dashboard">
            <label for>Hasta</label>
            <date-picker
              v-model="filter.to"
              type="month"
              lang="es"
              format="M/YYYY"
              value-type="format"
              :clearable="false"
              class="form-control-dashboard"
              @change="getData"
            >
              <template v-slot:icon-calendar></template>
            </date-picker>
          </div>
        </div>
      </div>
      <apexchart
        class="apex-charts"
        height="450"
        type="bar"
        dir="ltr"
        :series="baseChart.series"
        :options="baseChart.chartOptions"
      ></apexchart>
    </div>
  </div>
</template>
<script>
import DatePicker from "vue2-datepicker";
import MetricService from "@/services/metric-service";

export default {
  name: "RankingProduct",
  components: {
    DatePicker,
  },
  data() {
    return {
      filter: {
        from: "",
        to: "",
      },
      reporte: [],
    };
  },
  created() {
    let today = new Date();
    this.filter.from = `${1}/${today.getFullYear()}`;
    this.filter.to = `${today.getMonth() + 1}/${today.getFullYear()}`;
    this.getData();
  },
  computed: {
    baseChart() {
      let chart = {
        series: this.reporte.map((x) => {
          return { name: x.name, data: [x.total_products] };
        }),
        chartOptions: {
          chart: {},
          legend: {
            show: true,
            position: "top",
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: "bottom", // top, center, bottom
              },
            },
          },
          dataLabels: {
            enabled: true,
            style: {
              fontSize: "14px",
              colors: ["#333", "#333", "#333", "#333"],
            },
          },
          colors: ["#36a2eb", "#556ee6", "#d5352e", "#f1bc62"],
          grid: {
            borderColor: "#f1f1f1",
          },
          xaxis: {
            categories: ["Metodo de pago"],
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            tooltip: {
              enabled: false,
              offsetY: -35,
            },
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
          },
          fill: {
            opacity: 1,
          },
          yaxis: {
            axisBorder: {
              show: true,
            },
            axisTicks: {
              show: true,
            },
            labels: {
              show: true,
              style: {
                fontSize: "12px",
                fontWeight: 400,
                fontFamily: "Open Sans",
                colors: ["#7286EA"],
                backgroundColor: "#e7e7e7",
              },
            },
            title: {
              text: "Pedidos",
              style: {
                colors: "#fff",
                fontSize: "12px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 600,
                cssClass: "apexcharts-yaxis-title",
              },
            },
          },
        },
      };
      return chart;
    },
  },
  methods: {
    getData() {
      console.log("getData");
      MetricService.getRankingProduct(this.filter).then((response) => {
        this.reporte = response.data;
      });
    },
  },
};
</script>
