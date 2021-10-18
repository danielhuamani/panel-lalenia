<template>
  <ul class="pagination pagination-rounded justify-content-end mb-2 mt-4">
    <li
      class="page-item"
      :class="{ disabled: !links.previous }"
      @click.prevent="setLink(links.previous)"
    >
      <a class="page-link" href="javascript: void(0);" aria-label="Previous">
        <i class="mdi mdi-chevron-left"></i>
      </a>
    </li>
    <template v-if="pages.total_pages">
      <li
        class="page-item"
        v-for="(index, page) in pages.total_pages"
        :key="page"
        :class="{ active: index == pages.current }"
        @click.prevent="setPage(index)"
      >
      <a class="page-link" href="javascript: void(0);">{{ index }} </a>
    </li>
    </template>

    <li
      class="page-item"
      :class="{ disabled: !links.next }"
      @click.prevent="setLink(links.next)"
    >
      <a class="page-link" href="javascript: void(0);" aria-label="Next">
        <i class="mdi mdi-chevron-right"></i>
      </a>
    </li>
  </ul>
</template>
<script>
export default {
  name: "page",
  props: ["links", "pages"],
  data() {
    return {};
  },
  methods: {
    setLink(url) {
      if (url) {
        this.$emit("set-link", url);
      }
    },
    setPage(page) {
      if (page != this.pages.current) {
        this.$emit("set-page", page);
      }
    },
  },
};
</script>
