<template>
  <div>
    <!-- title="User Settings" -->
    <b-card class="mx-lg-auto mb-4" align-h="center" style="max-width: 1000px">
      <b-row class="justify-content-md-center">
        <b-col cols="auto" class="mr-auto mb-lg-auto mb-3">
          <!-- TODO manual updates to custom accounts (e.g. cars, cash, and non-banking assets) -->
          <b-button variant="light" style="min-width: 200px" v-b-modal.manual
            >Edit Manual Accounts</b-button
          >
          <b-modal id="manual" title="Edit Manual Accounts" ok-only>
            <p class="my-4">
              Under construction...<br /><br />For now, accounts that are not
              linked through Plaid must be edited directly in the database.
              <br /><br />This is useful if an account is not available through
              Plaid or if you want to track assets such as vehicles and
              property.
            </p>
          </b-modal>
        </b-col>

        <b-col cols="auto" class="mr-auto mb-lg-auto mb-3">
          <!-- TODO Edit goals. link to multiple accounts with multi picker -->
          <b-button variant="light" style="min-width: 200px" v-b-modal.goals
            >Edit Goals</b-button
          >
          <b-modal id="goals" title="Edit Goals" ok-only>
            <p class="my-4">
              Under construction...<br /><br />For now, Goals can be edited
              directly in the database.
            </p>
          </b-modal>
        </b-col>

        <b-col cols="auto">
          <b-button variant="light" style="min-width: 200px" v-b-modal.settings
            >Other Settings</b-button
          >
          <b-modal id="settings" title="Other Settings" ok-only>
            <p class="my-4">
              Placeholder for future settings options. <br /><br />
              Appearance: Show/hide charts on main page <br /><br />
              Theme: Use
              <a href="https://darkreader.org/" target="blank">darkreader</a>
              extension for dark theme. <br /><br />
              Notifications: enable/disable
            </p>
          </b-modal>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'user-settings',
  components: {},

  data() {
    return {}
  },
  mounted() {},

  methods: {},
  computed: {},
}
</script>

<style scoped></style>
