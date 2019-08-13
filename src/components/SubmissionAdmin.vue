<template>
  <tr>
    <td>
      {{ submission.rank }}
      <br>
      <code>{{ submission._id }}</code>
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
      <br>
      <code>{{ submission.creator ? submission.creator.email: '...' }}</code>
      <v-alert
        v-if="admin"
        :value="true"
        color="info"
      >
        <v-edit-dialog
          :return-value.sync="submission.organization"
          lazy
          persistent
          @save="saveSubmissionField(submission, 'organization')"
        >
          Team Name: <code>{{ submission.organization }}</code>
          <v-text-field
            slot="input"
            v-model="submission.organization"
            label="Edit Team Name"
            autofocus
          />
        </v-edit-dialog>
        <v-edit-dialog
          :return-value.sync="submission.organizationUrl"
          lazy
          persistent
          @save="saveSubmissionField(submission, 'organizationUrl')"
        >
          Team URL: <code>{{ submission.organizationUrl }}</code>
          <v-text-field
            slot="input"
            v-model="submission.organizationUrl"
            label="Edit Team URL"
            autofocus
          />
        </v-edit-dialog>
      </v-alert>
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
      <div v-if="admin && submission.meta.arxivUrl">
        arXiv URL: <code>{{ submission.meta.arxivUrl }}</code>
      </div>
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
      </template>
    </td>
  </tr>
</template>

<script>
import http from '../http';

export default {
  name: 'SubmissionAdmin',

  props: {
    submission: Object,
  },

  data() {
    return {
      admin: true,
    };
  },

  methods: {
    async saveSubmissionMeta() {
      // URLSearchParams causes a 'application/x-www-form-urlencoded' body
      const requestBody = new URLSearchParams();
      requestBody.append('meta', JSON.stringify(this.submission.meta));

      await http.request({
        method: 'put',
        url: `covalic_submission/${this.submission._id}`,
        data: requestBody,
      });
    },

    async saveSubmissionField(fieldName) {
      // URLSearchParams causes a 'application/x-www-form-urlencoded' body
      const requestBody = new URLSearchParams();
      requestBody.append(fieldName, this.submission[fieldName]);

      await http.request({
        method: 'put',
        url: `covalic_submission/${this.submission._id}`,
        data: requestBody,
      });
    },

    async loadCreatorUser() {
      const creatorResponse = await http.request({
        method: 'get',
        url: `user/${this.submission.creatorId}`,
      });

      this.$set(this.submission, 'creator', creatorResponse.data);
    },
  },
};
</script>
