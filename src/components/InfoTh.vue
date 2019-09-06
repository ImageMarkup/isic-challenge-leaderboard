<template functional>
  <component
    :class="props.addclass"
    :is="props.header ? 'th' : 'td'"
    v-bind="data.attrs"
  >
    <slot />
    <v-tooltip
      v-if="props.tooltip"
      bottom
      max-width="400"
    >
      <template #activator="{ on }">
        <v-icon
          small
          v-on="on"
        >
          mdi-information
        </v-icon>
      </template>
      <span>
        {{ props.tooltip }}
      </span>
    </v-tooltip>
  </component>
</template>

<script>
export default {
  name: 'InfoTh',
  props: {
    tooltip: {
      type: String,
      default: '',
    },
    header: {
      type: Boolean,
      default: false,
    },
    addclass: {
      type: String,
      default: '',
    },
  },
};
</script>
