<template>
  <div class="card-body">
    <div class="d-flex flex-row-reverse">
      <div class="flex-grow-1 d-flex flex-column align-items-end">
        <p class="text-muted fw-medium mb-2">Total Pedidos (Hoy)</p>
        <h4 class="mb-0">{{ total }}</h4>
      </div>
      <div
        class="
          avatar-sm
          align-self-center
          mini-stat-icon
          rounded-circle
          bg-primary
        "
      >
        <span class="avatar-title bg-black"
          ><i class="fas fa-shopping-bag font-size-24"></i
        ></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "OrderByDate",
  props: ["total"],
};
</script>