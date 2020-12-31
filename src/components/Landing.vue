<template>
  <div class="pt-lg-5 pt-xs-2 mx-auto" style="max-width: 1024px">
    <b-carousel
      class="mx-lg-5 mx-xs-0"
      :interval="6000"
      id="carousel-fade"
      style="text-shadow: 1px 1px 2px #333;"
      background="LightGray"
      fade
      controls
      indicators
      img-width="1024"
      img-height="1024"
      no-wrap
    >
      <!-- img-src="https://picsum.photos/1024?random=1" -->
      <!-- img-src="https://picsum.photos/id/10/1024" -->
      <b-carousel-slide
        caption="Simple and Secure"
        img-src="../assets/10-1024x1024.jpg"
      >
        <h4>
          Connect your financial accounts. <br />
          Automatically update balances and transactions.
        </h4>
      </b-carousel-slide>
      <b-carousel-slide
        caption="Practical and Private"
        img-src="../assets/480-1024x1024.jpg"
      >
        <h4>
          Intuitive charts and tables to manage all your finances.<br />
          No advertisers in sight.
        </h4>
      </b-carousel-slide>
      <b-carousel-slide
        caption="Open to All"
        img-src="../assets/994-1024x1024.jpg"
      >
        <h4>
          Try out this sample app. <br />
          Or
          <a href="https://github.com/blairun/FinancialVueDo" target="blank"
            >fork the code
          </a>
          to create your own FinancialVue.
        </h4>
        <br />
        <b-button class="mb-3" @click="navigate">
          Try it now
        </b-button>
      </b-carousel-slide>
    </b-carousel>
    <div class="footer">
      <p>
        FinancialVue is an app for managing personal finances.
        <a href="#/about" target="blank">Learn more here. </a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      image1: 'https://picsum.photos/1024',
    }
  },
  methods: {
    navigate() {
      this.$router.push({
        name: 'login',
      })
    },
  },
}
</script>

<style scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
}
@media (min-width: 992px) {
  .carousel {
    border-radius: 8px 8px 8px 8px;
    overflow: hidden;
  }
}
</style>
