<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo"> -->
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
     <!--   <img v-if="logo" :src="logo" class="sidebar-logo"> -->
      </router-link>
    </transition>
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import logoImg from '@/assets/image/navlogo.png'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Hamburger
  },
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  data() {
    return {
      logo: logoImg
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.hamburger-container {
    height: 100%;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
.sidebar-logo-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100px;
  // line-height: 100px;
  background: #3370EA;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
	  display: flex;
	  flex-direction: row;
	  align-items: center;
    & .sidebar-logo {
      height: 40px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
