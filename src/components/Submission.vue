<template>
  <tr>
    <td>
      {{ submission.rank }}
    </td>
    <td>
      <template v-if="submission.organizationUrl">
        <a
          :href="submission.organizationUrl"
          target="_blank"
          rel="noopener noreferrer">
          {{ submission.organization }}
        </a>
      </template>
      <template v-else>
        {{ submission.organization }}
      </template>
      <br>
      <i>({{ submission.creatorName }})</i>
    </td>
    <td>
      {{ submission.approach }}
    </td>
    <td>
      <template v-if="submission.documentationUrl">
        <a
          :href="submission.documentationUrl"
          target="_blank"
          rel="noopener">
          <v-icon color="green">assignment</v-icon>
        </a>
      </template>
      <template v-else>
        <v-icon color="red">close</v-icon>
      </template>
    </td>
    <td>
      <template v-if="submission.meta.usesExternalData">
        <v-icon color="orange">public</v-icon>
        Yes
      </template>
      <template v-else>
        <v-icon color="blue">vpn_lock</v-icon>
        No
      </template>
    </td>
    <td>
      <v-tooltip bottom>
        <span slot="activator">{{ submission.overallScore.toPrecision(3) }}</span>
        <span>{{ submission.overallScore }}</span>
      </v-tooltip>
      <template v-if="expanded">
        <v-icon>expand_less</v-icon>
      </template>
      <template v-else>
        <v-icon>expand_more</v-icon>
      </template>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'Submission',

  props: {
    submission: {
      type: Object,
      required: true,
    },
    expanded: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped lang="stylus">
  td
    word-break break-word
</style>
