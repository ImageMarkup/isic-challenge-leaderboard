<template>
  <tr>
    <td>
      {{ submission.rank }}
    </td>
    <td>
      <span>{{ submission.team_name }}</span>
      <br>
      <template v-if="submission.team_institution_url">
        <a
          :href="submission.team_institution_url"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
        >
          {{ submission.team_institution_name || '&lt;Institution&gt;' }}
        </a>
      </template>
      <template v-else>
        <span>{{ submission.team_institution_name }}</span>
      </template>
    </td>
    <td>
      {{ submission.approach_name }}
    </td>
    <td>
      <template v-if="submission.approach_manuscript_url">
        <a
          :href="submission.approach_manuscript_url"
          target="_blank"
          rel="noopener"
          @click.stop
        >
          <v-icon color="green">mdi-clipboard-text</v-icon>
        </a>
      </template>
      <template v-else>
        <v-icon color="red">
          mdi-close
        </v-icon>
      </template>
    </td>
    <td>
      <template v-if="submission.approach_uses_external_data">
        <v-icon color="orange">
          mdi-earth
        </v-icon>
        Yes
      </template>
      <template v-else>
        <v-icon color="blue">
          mdi-earth-off
        </v-icon>
        No
      </template>
    </td>
    <td class="d-flex align-center justify-space-between">
      <v-tooltip bottom>
        <template #activator="{ on }">
          <span v-on="on">{{ submission.overall_score.toPrecision(3) }}</span>
        </template>
        <span>{{ submission.overall_score }}</span>
      </v-tooltip>

      <v-btn icon>
        <!-- TODO: Prevent focus -->
        <v-icon>{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'SubmissionRow',

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
