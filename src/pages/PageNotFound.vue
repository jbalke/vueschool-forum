<template>
  <div class="col-full" :class="$style.centred">
    <h1 :class="$style.headingLarge">Not Found</h1>
    <p :class="$style.textLarge">Oops, we couldn't find what you were looking for. Why not
      <router-link :to="{name: 'Home'}">
        go home instead?
      </router-link>
    </p>
  </div>
</template>

<script>
export default {
  created() {
    this.$emit("ready");
  }
};
</script>

<style module>
.headingLarge {
  font-size: 6rem;
}
.textLarge {
  font-size: 3rem;
  font-weight: 200;
}
.centred {
  text-align: center;
}
</style>
