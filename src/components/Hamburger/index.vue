<template>
  <div class="hamburgerbox" @click="toggleClick">
    <svg :class="{'is-active':isActive}" class="hamburger" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
      width="64" height="64" fill="#fff">
      <path d="M84.8 244.8h852.8c28.8 0 52.8-24 52.8-52.8s-24-52.8-52.8-52.8H84.8C56 139.2 32 163.2 32 192s24 52.8 52.8 52.8zM939.2 459.2H84.8C56 459.2 32 483.2 32 512s24 52.8 52.8 52.8h852.8c28.8 0 52.8-24 52.8-52.8s-22.4-52.8-51.2-52.8zM939.2 779.2H84.8C56 779.2 32 803.2 32 832s24 52.8 52.8 52.8h852.8c28.8 0 52.8-24 52.8-52.8s-22.4-52.8-51.2-52.8z"></path>
    </svg>
  </div>
</template>
<script>
  export default {
    name: 'Hamburger',
    props: {
      isActive: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      toggleClick() {
        this.$emit('toggleClick')
      }
    }
  }
</script>
<style scoped>
  .hamburgerbox{padding: 0 7px;display: flex;flex-direction: row;align-items: center;}
  .hamburger {
    display: inline-block;
    vertical-align: middle;
    width: 24px;
    height: 30px;
  }

  .hamburger.is-active {
    transform: rotate(180deg);
  }
</style>
