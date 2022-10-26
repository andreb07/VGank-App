<template>
   <section id="vg-loading" class="show">
    <img class="logo" :src="logo" />
    <img class="spinner" :src="spinner" />
  </section>

</template>

<script>
export default {
  data: () => ({
      logo: require('@/assets/imgs/loading_logo.svg'),
      spinner: require('@/assets/imgs/loading_spinner.svg')
  })
}
</script>

<style>

</style>