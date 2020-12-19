<template>
  <v-app>
   <Calendario></Calendario>
   <Footer></Footer>
  </v-app>
</template>

<script>
import Calendario from './components/Calendario';
import Footer from './components/Footer'

export default {
  name: 'App',

  components: {
    Calendario,
    Footer
  },

  data: () => ({
    //
  }),
};
</script>
