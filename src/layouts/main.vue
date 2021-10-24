<script>
import {
    layoutComputed
} from "@/state/helpers";
import Notification from "@/components/base/notification";
import Vertical from "./vertical";

export default {
    components: {
        Vertical,
        Notification
    },
    data() {
        return {};
    },
    computed: {
        ...layoutComputed,
        getAlert() {
            return this.$store.getters["notification/getAlert"];
        }
    },
    methods: {},
    mounted() {
        // document.querySelector("html").setAttribute('dir', 'rtl');
    }
};
</script>

<template>
<div>
    <Notification v-if="getAlert.is_alert" :alert="getAlert" />
    <Vertical layout="vertical">
        <slot />
    </Vertical>
</div>
</template>
