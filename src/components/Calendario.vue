<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn color="primary" dark class="mr-2" @click="dialog = true"
            >Agregar</v-btn
          >
          <v-btn outlined class="mr-2" color="grey darken-2" @click="setToday"
            >Hoy</v-btn
          >
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Día</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 días</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
          locale="es"
          :short-weekdays="true"
        ></v-calendar>

        <!-- Modal Agregar Evento -->
        <v-dialog v-model="dialog" max-width="500">
          <v-card>
            <v-container>
              <h2>Nuevo Evento</h2>
              <v-form @submit.prevent="addEvent">
                <v-text-field
                  type="text"
                  label="Título"
                  v-model="name"
                ></v-text-field>
                <v-text-field
                  type="text"
                  label="Detalles"
                  v-model="details"
                ></v-text-field>
                <v-text-field
                  type="date"
                  label="Inicio del evento"
                  v-model="start"
                ></v-text-field>
                <v-text-field
                  type="date"
                  label="Fin del evento"
                  v-model="end"
                ></v-text-field>
                 <v-text-field
                  type="time"
                  label="Hora"
                  v-model="time"
                ></v-text-field>
                <v-text-field
                  type="color"
                  label="Color"
                  v-model="color"
                ></v-text-field>
                <v-btn
                  class="mr-4"
                  @click.stop="dialog = false"
                  >Cancelar</v-btn
                >
                <v-btn
                  type="submit"
                  color="primary"
                  class="mr-4"
                  >Guardar</v-btn
                >
              </v-form>
            </v-container>
          </v-card>
        </v-dialog>

        <!-- Snackbar -->
        <v-snackbar v-model="snackbar" color="error" type="error">
          <v-icon left color="white">mdi-cancel</v-icon>
           Llena todos los campos!
          <template v-slot:action="{ attrs }">
            <v-btn color="white" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
          </template>
        </v-snackbar>
        <!-- End Snackbar -->

        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon @click="deleteEvent(selectedEvent)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text>
              <v-form v-if="currentlyEditing !== selectedEvent.id">
                <p>{{ selectedEvent.details }}</p> 
                <p>Hora: {{ selectedEvent.time }}</p>
              </v-form
              >
              <v-form v-else>
                <v-text-field
                  type="text"
                  label="Editar titulo"
                  v-model="selectedEvent.name"
                ></v-text-field>
                <v-text-field
                  type="time"
                  label="Editar hora"
                  v-model="selectedEvent.time"
                ></v-text-field>
                <textarea-autosize
                  v-model="selectedEvent.details"
                  type="text"
                  style="width: 100%"
                  :min-height="100"
                ></textarea-autosize>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false"
                >Cancelar</v-btn
              >
              <v-btn
                text
                v-if="currentlyEditing !== selectedEvent.id"
                @click.prevent="editEvent(selectedEvent.id)"
                >Editar</v-btn
              >
              <v-btn text v-else @click.prevent="updateEvent(selectedEvent)"
                >Guardar Cambios</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { db } from "../main";
export default {
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: "month",
    typeToLabel: {
      month: "Mes",
      week: "Semana",
      day: "Día",
      "4day": "4 días",
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    name: null,
    details: null,
    time: null,
    color: "#1976D2",
    dialog: false,
    currentlyEditing: null,
    snackbar: false,
  }),
  computed: {
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long",
      });
    },
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  created() {
    this.getEvents();
  },
  methods: {
    async updateEvent(ev) {
      try {
        await db
          .collection("eventos")
          .doc(ev.id)
          .update({
            name: ev.name,
            details: ev.details,
            time: ev.time
          });
          
        this.getEvents();
        this.selectedOpen = false;
        this.currentlyEditing = null;
      } catch (error) {
        console.log(error);
      }
    },
    editEvent(id) {
      this.currentlyEditing = id;
    },
    async deleteEvent(ev) {
      try {
        await db
          .collection("eventos")
          .doc(ev.id)
          .delete();
        this.selectedOpen = false;
        this.getEvents();
      } catch (error) {
        console.log(error);
      }
    },
    async addEvent() {
      try {
        if (this.name && this.start && this.end) {
          await db.collection("eventos").add({
            name: this.name,
            details: this.details,
            start: this.start,
            end: this.end,
            time: this.time,
            color: this.color,
          });

          this.getEvents();

          this.dialog = false;
          this.name = null;
          this.details = null;
          this.start = null;
          this.end = null;
          this.time = null;
          this.color = "#1976D2";
        } else {

          this.snackbar = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getEvents() {
      try {
        const snapshot = await db.collection("eventos").get();
        const events = [];

        snapshot.forEach((doc) => {
          //console.log(doc.id);
          let eventoData = doc.data();
          eventoData.id = doc.id;
          events.push(eventoData);
        });

        this.events = events;
      } catch (error) {
        console.log(error);
      }
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end, time }) {
      // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      this.start = start;
      this.end = end;
      this.time = time;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
  },
};
</script>
