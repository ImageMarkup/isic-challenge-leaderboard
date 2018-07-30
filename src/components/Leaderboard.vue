<template>
  <v-data-table
    :headers="headers"
    :items="submissions"
    :loading="loading"
    hide-actions
    must-sort
  >
    <template slot="items" slot-scope="{ item: submission, expanded }">
      <td>
        {{ submission.number }}
        <br>
        <code>{{ submission._id }}</code>
      </td>
      <td>
        <a :href="submission.organizationUrl" target="_blank" rel="noopener noreferrer">
          {{ submission.organization }}
        </a>
        <br>
        <i>({{ submission.creatorName }})</i>
        <v-alert
          v-if="admin"
          :value="true"
          color="info"
        >
          Team URL: <code>{{ submission.organizationUrl }}</code>
        </v-alert>
      </td>

      <td>
        <v-edit-dialog
          lazy
          large
          persistent
          :return-value.sync="submission.meta.authors"
          @save="saveSubmissionMeta(submission)"
        >
          <template v-if="submission.meta.authors">
            <i>{{ submission.meta.authors }}</i>
          </template>
          <template v-else>
            <i>Click to set</i>
          </template>
          <v-textarea
            slot="input"
            v-model="submission.meta.authors"
            label="Edit Authors"
            autofocus
          >
          </v-textarea>
        </v-edit-dialog>
      </td>

      <td>
        {{ submission.approach }}
      </td>
      <td>
        <template v-if="submission.documentationUrl">
          <a :href="submission.documentationUrl" target="_blank" rel="noopener">
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
      <td v-if="admin">
        <v-icon v-if="submission.meta.agreeToSharingPolicy" color="green">check</v-icon>
        <v-icon v-else color="red">close</v-icon>
      </td>

      <td>
        <template v-if="submission.meta.documentationReview">
          <template v-if="submission.meta.documentationReview.accepted">
            <v-icon color="green">check</v-icon>
            Accepted <i>({{ submission.meta.documentationReview.userLogin }})</i>
          </template>
          <template v-else>
            <v-icon color="red">close</v-icon>
            Rejected <i>({{ submission.meta.documentationReview.userLogin }})</i>
          </template>
          <v-btn
            @click.stop="reviewDocumentation(submission, null)"
            small
            color="orange"
          >
            Reset
          </v-btn>
        </template>
        <template v-else>
          <v-btn
            @click.stop="reviewDocumentation(submission, true)"
            small
            color="green"
          >
            Accept
          </v-btn>
          <v-btn
            @click.stop="reviewDocumentation(submission, false)"
            small
            color="red"
          >
            Reject
          </v-btn>
        </template>
      </td>
    </template>
    <template slot="footer">
      <input type="checkbox" id="leaderboard-admin" v-model="admin">
      <label for="leaderboard-admin">Admin mode</label>
    </template>
  </v-data-table>
</template>

<script>
import http from '../http';

export default {
  name: 'Leaderboard',

  props: {
    phaseId: String,
    user: Object,
  },

  data() {
    return {
      admin: false,
      submissions: [],
      loading: true,
    };
  },

  async created() {
    await this.loadData();
  },

  computed: {
    submissionsWithoutExternalData() {
      return this.submissions.filter(submission => !submission.meta.usesExternalData);
    },

    headers() {
      return [
        {
          text: 'Number (ID)',
          value: 'number',
        },
        {
          text: 'Team (Submitter User)',
          value: 'organization',
        },
        {
          text: 'Author Names',
          value: null,
        },
        {
          text: 'Approach Name',
          value: 'approach',
          sortable: false,
        },
        {
          text: 'arXiv Abstract',
          value: 'documentationUrl',
          sortable: false,
        },
        {
          text: 'Used External Data',
          value: 'meta.usesExternalData',
        },
        ...(
          this.admin ?
            [{
              text: 'Agreed To Sharing Policy',
              value: 'meta.agreeToSharingPolicy',
            }]
            : []
        ),
        {
          text: 'Manuscript Reviewed',
          value: 'meta.documentationReview',
          sortable: false,
        },
      ];
    },
  },

  methods: {
    async reviewDocumentation(submission, accepted) {
      if (accepted === true || accepted === false) {
        this.$set(
          submission.meta,
          'documentationReview',
          {
            accepted,
            time: new Date().toISOString(),
            userId: this.user._id, // eslint-disable-line no-underscore-dangle
            userLogin: this.user.login,
          },
        );
      } else {
        this.$delete(submission.meta, 'documentationReview');
      }

      await this.saveSubmissionMeta(submission);
    },

    async saveSubmissionMeta(submission) {
      // URLSearchParams causes a 'application/x-www-form-urlencoded' body
      const requestBody = new URLSearchParams();
      requestBody.append('meta', JSON.stringify(submission.meta));

      await http.request({
        method: 'put',
        url: `covalic_submission/${submission._id}`,
        data: requestBody,
        withCredentials: false,
        responseType: 'json',
      });

      await this.loadData();
    },

    async loadData() {
      this.loading = true;

      try {
        const submissionsResponse = await http.request({
          method: 'get',
          url: 'covalic_submission',
          params: {
            limit: 0,
            offset: 0,
            sort: 'organization',
            sortdir: 1,
            phaseId: this.phaseId,
          },
          withCredentials: false,
          responseType: 'json',
        });
        submissionsResponse.data.forEach((submission, index) => {
          submission.number = index + 1; // eslint-disable-line no-param-reassign
        });

        this.submissions = submissionsResponse.data;
      } catch (e) {
        // TODO: Covalic may 401 here if the phase scores are hidden and the user isn't logged in
      }

      this.loading = false;

      // Polling causes edit boxes to refresh while typing
      // window.setTimeout(this.loadData.bind(this), 5000);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
</style>
