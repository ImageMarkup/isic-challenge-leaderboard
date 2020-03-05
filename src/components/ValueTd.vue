<template functional>
  <td
    v-bind="data.attrs"
    :class="[
      data.class,
      data.staticClass
    ]"
  >
    <v-tooltip bottom>
      <template #activator="{ on }">
        <!--TODO: activate on the whole <td>, not just the span-->
        <span v-on="on">
          {{ (props.value !== null) ? props.value.toPrecision(3) : '' }}
        </span>
      </template>
      <span>
        {{ (props.value !== null) ? props.value : '' }}
      </span>
    </v-tooltip>
  </td>
</template>

<script>
export default {
  name: 'ValueTd',
  props: {
    value: {
      required: true,
      default: null,
      validator: (value) => typeof value === 'number' || value === null,
    },
  },
};
</script>
