<template>
  <!-- End Footer -->
    <v-footer color="#42b983" padless>
      <v-col cols="12">
        <v-card flat tile class=" white--text text-center" color="#42b983">
          <v-card-text>
            <v-btn href="https://www.facebook.com/carliitos.3098/" class="mx-4 white--text" target="_blank" icon>
              <v-icon size="30px"> mdi-facebook </v-icon>
            </v-btn>
            <v-btn href="https://github.com/Carlosramirez-dev" class="mx-4 white--text" target="_blank" icon>
              <v-icon size="30px"> mdi-github </v-icon>
            </v-btn>
            <v-btn href="http://www.linkedin.com/in/carlosr-dev" class="mx-4 white--text" target="_blank" icon>
              <v-icon size="30px"> mdi-linkedin </v-icon>
            </v-btn>
            <v-btn href="https://www.instagram.com/carlosr.dev" class="mx-4 white--text" target="_blank" icon>
              <v-icon size="30px"> mdi-instagram </v-icon>
            </v-btn>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text class="white--text">
            {{ new Date().getFullYear() }} — <strong>Carlos Ramirez</strong>
          </v-card-text>
        </v-card>
      </v-col>
    </v-footer>
<!-- End Footer -->
</template>
    
<script>
export default {
  name: "Footer",
  data: () => ({
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
  }),
};
</script>