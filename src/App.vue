<template>
  <div id="app">
    <h1>simple flowchart</h1>


    <form @submit="agregarObject()">
      <!-- <form @submit.prevent="agregarObject()" v-if="agregar"> -->
      <!-- <h3 class="text-center">Agregar nueva Object</h3> -->
      <div id="zero">
        <input
          type="text"
          placeholder="Asunto"
          class="form-control my-2"
          v-model="tit"
        />
        <input
          type="text"
          placeholder="Ingrese una descripcion"
          class="form-control my-2"
          v-model="desc"
        />

      <b-list-group
        horizontal
        v-model="cat"
      >
        <b-list-group-item button btn-group-sm
          v-for="categorie in categories"
          v-bind:value="categorie"
          v-bind:key="categorie"
          v-on:click="cat=categorie; nodeClick(cat)"
          >{{ categorie }}</b-list-group-item
        >
      </b-list-group>

        <select
          v-model="cat"
          multiple="true"
          size="2"
        >
          <option
            v-for="categorie in categories"
            v-bind:value="categorie"
            v-bind:key="categorie"
            >{{ categorie }}</option
          >
        </select>
        </div>

    </form>


    <div class="tool-wrapper">
      <select v-model="newNodeType">
        <option v-for="(item, index) in nodeCategory" :key="index" :value="index">{{item}}</option>
      </select>
      <input type="text" v-model="newNodeLabel" placeholder="Input node label">
      <button @click="addNode">ADD</button>
    </div>

    <simple-flowchart
      v-bind:scene="scene"
      :nodes.sync="objectNodes"
      @nodeClick="nodeClick"
      @nodeSelected="nodeSelected"
      @nodeDelete="nodeDelete"
      @linkEvent="linkEvent"
      @canvasClick="canvasClick"
      @nodeMoved="nodeMoved"
      :height="800"
    />
  </div>
</template>

<script>
import SimpleFlowchart from "./components/SimpleFlowchart.vue";

export default {
  name: "app",
  components: {
    SimpleFlowchart
  },
  data() {
    return {
      tit: "",
      desc: "",
      cat: [],
      categories: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
      objectNodeAgregar: {
        titulo: "",
        descripcion: "",
        contactos: [],
        mails: [],
        appoints: [],
        notes: [],
        categories: [],
      },      
      scene: {
        centerX: 1024,
        centerY: 140,
        scale: 1,
        mainScale: 1,
        links: [
          {
            id: 3,
            from: 2, // node id the link start
            to: 4 // node id the link end
          }
        ]
      },
      objectNodes: [
        {
          //id: 1,
          _id: "1",
          titulo: "titulo1",
          x: -700,
          y: -69,
          width: 0,
          height: 0,
          descripcion: "descripcion1descripcion1descripcion1",
          //type: "Rule",
          //label: "titulo1",
          children: ["2", "3", "4"],
          categories: ["100. aaaaaa", "200. bbbbbb"]
        },
        {
          //id: 2,
          _id: "2",
          titulo: "titulo2",
          x: -357,
          y: 80,
          width: 0,
          height: 0,

          descripcion: "descripcion2descripcion2descripcion2",
          //type: "Rule",
          //label: "titulo2",
          children: ["3"],
          categories: ["100. aaaaaa", "200. bbbbbb"]
        },
        {
          //id: 3,
          _id: "3",
          titulo: "titulo3",
          x: -557,
          y: 80,
          width: 0,
          height: 0,

          descripcion: "descripcion3",
          //type: "Rule",
          //label: "titulo3",
          children: [],
          categories: ["100. aaaaaa", "200. bbbbbb"]
        },
        {
          //id: 4,
          _id: "4",
          titulo: "titulo4",
          x: -457,
          y: 180,
          width: 0,
          height: 0,

          descripcion: "descripcion",
          //type: "Rule",
          //label: "titulo4",
          children: []
        }
      ],
      newNodeType: 0,
      newNodeLabel: "",
      nodeCategory: ["rule", "action", "script", "decision", "fork", "join"]
    };
  },
  methods: {
    canvasClick(e) {
      //console.log("canvas Click, event:", e);
      //console.log("canvas Click", this.objectNodes);
    },
    addNode() {
      let maxID = Math.max(
        0,
        ...this.objectNodes.map(link => {
          return link.id;
        })
      );
      this.objectNodes.push({
        id: maxID + 1,
        x: -400,
        y: 50,
        type: this.nodeCategory[this.newNodeType],
        label: this.newNodeLabel ? this.newNodeLabel : `test${maxID + 1}`
      });
      //console.log(this.objectNodes);
    },
    nodeClick(id) {
      console.log("node click", id);
    },
    nodeSelected(id) {
      console.log("nodeSelected", id);
    },
        nodeMoved(id) {
      console.log("node nodeMoved", id);
    },
    nodeDelete(id) {
      console.log("node delete", id);
      console.log(this.objectNodes);
    },
    linkEvent(id) {
      console.log("link break", id);
      console.log(this.scene);
    },

  }
};
</script>

<style lang="scss">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-image: linear-gradient(to top right, rgb(243, 199, 217), rgb(89, 89, 247));
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  overflow: hidden;
  height: 800px;
  .tool-wrapper {
    position: relative;
  }
}
#app > zero{
  width: 250px;
  margin:10px;
}
#agregar_left{
  width: 100px;
  margin:10px;
  border:1px solid red;
}
#agregar_right{
  width: 100px;
  margin:10px;
  border:1px solid blue;
}

</style>
