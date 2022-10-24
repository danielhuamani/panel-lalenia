
<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-md-4">
            <div class="card mini-stats-wid">
              <OrderByDateEarn
                :total="order_by_date.total_earn"
              ></OrderByDateEarn>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card mini-stats-wid">
              <OrderByDate :total="order_by_date.total"></OrderByDate>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card mini-stats-wid">
              <OrderByDateEarnAvg
                :total="order_by_date.total_average_earn"
              ></OrderByDateEarnAvg>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="row">
          <div class="col-6">
            <OrderByPaymentMethod></OrderByPaymentMethod>
          </div>
          <div class="col-6">
            <RankingProduct></RankingProduct>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<script>
import Layout from "../layouts/main";
import appConfig from "@/app.config";
import PageHeader from "@/components/page-header";
import OrderByDate from "@/components/metric/order-by-date";
import OrderByDateEarn from "@/components/metric/order-by-date-earn";
import OrderByDateEarnAvg from "@/components/metric/order-by-date-earn-avg";
import OrderByPaymentMethod from "@/components/metric/order-by-payment-methods";
import RankingProduct from "@/components/metric/ranking-product";
import MetricService from "@/services/metric-service";
/**
 * Dashboard Component
 */
export default {
  page: {
    title: "Dashboard",
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
    OrderByDate,
    OrderByDateEarn,
    OrderByDateEarnAvg,
    OrderByPaymentMethod,
    RankingProduct,
  },
  data() {
    return {
      title: "Dashboard",
      items: [],
      order_by_date: {
        total: 0,
        total_earn: 0,
        total_average_earn: 0,
      },
    };
  },
  created() {
    this.getOrderByDate();
  },
  mounted() {},
  methods: {
    getOrderByDate() {
      MetricService.getOrderByDate().then((response) => {
        this.order_by_date.total = response.data.total;
        this.order_by_date.total_earn = response.data.total_earn;
        this.order_by_date.total_average_earn =
          response.data.total_average_earn;
      });
    },
  },
};
</script>
