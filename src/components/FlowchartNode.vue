<template>
  <div
    class="flowchart-node"
    :style="nodeStyle"
    @mousedown="handleMousedown"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
    v-bind:class="{selected: options.selected === _id}"
    ref="flowNode"
  >
    <div class="node-port node-input" @mousedown="inputMouseDown" @mouseup="inputMouseUp"></div>
    <div class="node-main">
      <div v-text="titulo" class="node-title"></div>
      <div v-text="descripcion" class="node-description"></div>
      <div>
        <br>
      </div>
    </div>
    <div class="node-port node-output" @mousedown="outputMouseDown"></div>
    <div v-show="show.delete" class="node-delete">&times;</div>
  </div>
</template>

<script>
import { generateCategorieColor } from "../utils/utils.js";
export default {
  name: "FlowchartNode",
  props: {
    // id: {
    //   type: Number,
    //   default: 1000,
    //   validator(val) {
    //     return typeof val === "number";
    //   }
    // },
    _id: {
      type: String,
      default: "",
      validator(val) {
        return typeof val === "string";
      }
    },
    x: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === "number";
      }
    },
    y: {
      type: Number,
      default: 0,
      validator(val) {
        return typeof val === "number";
      }
    },
    titulo: {
      type: String,
      default: "Default"
    },
    descripcion: {
      type: String,
      default: "descripción"
    },
    categories: {
      type: Array,
      default() {
        return [];
      }
    },
    options: {
      type: Object,
      default() {
        return {
          centerX: 1024,
          scale: 1,
          centerY: 140
        };
      }
    },
    width: {
      type: Number,
      default: 120
    },
    height: {
      type: Number,
      default: 80
    }
  },
  data() {
    return {
      show: {
        delete: false
      }
    };
  },
  mounted() {
    const width = this.$el.clientWidth;
    const height = this.$el.clientHeight;
    this.$emit("update:width", width);
    this.$emit("update:height", height);
  },
  computed: {
    color() {
      return generateCategorieColor(this.categories[0]);
    },
    brightness() {
      //console.log(this.color);

      let { r, g, b } = this.color;
      return 0.299 * r + 0.587 * g + 0.114 * b;
    },

    nodeStyle() {
      if (this.color) {
        let { r, g, b } = this.color;
        let background = `rgb(${r}, ${g}, ${b})`;
        let shadow = `rgba(${r}, ${g}, ${b}, 0.5)`;
        return {
          "background-color": background,
          "box-shadow": `0px 6px 20px ${shadow}`,
          color: this.brightness > 180 ? "#777" : "#f3f3f3",
          top: this.options.centerY + this.y * this.options.scale + "px", // remove: this.options.offsetTop +
          left: this.options.centerX + this.x * this.options.scale + "px", // remove: this.options.offsetLeft +
          transform: `scale(${this.options.scale})`
        };
      }

      return {
        top: this.options.centerY + this.y * this.options.scale + "px", // remove: this.options.offsetTop +
        left: this.options.centerX + this.x * this.options.scale + "px", // remove: this.options.offsetLeft +
        transform: `scale(${this.options.scale})`
      };
    }
  },
  methods: {
    handleMousedown(e) {
      const target = e.target || e.srcElement;
      //console.log("handleMousedown", e);
      if (
        target.className.indexOf("node-input") < 0 &&
        target.className.indexOf("node-output") < 0
      ) {
        this.$emit("nodeClick", e);
      }
      e.preventDefault();
    },
    handleMouseOver() {
      this.show.delete = true;
    },
    handleMouseLeave() {
      this.show.delete = false;
    },
    outputMouseDown(e) {
      this.$emit("linkingStart");
      e.preventDefault();
    },
    inputMouseDown(e) {
      e.preventDefault();
    },
    inputMouseUp(e) {
      this.$emit("linkingStop");
      e.preventDefault();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$themeColor: rgb(255, 136, 85);
$portSize: 12;

.flowchart-node {
  margin: 0;
  //  width: 120px;
  //  height: 80px;
  position: absolute;
  box-sizing: border-box;
  border: none;
  background: white;
  z-index: 1;
  opacity: 0.9;
  cursor: move;
  transform-origin: top left;
  .node-main {
    text-align: center;
    .node-title {
      background: $themeColor;
      color: white;
      font-size: 13px;
      padding: 6px;
    }
    .node-description {
      font-size: 13px;
    }
  }
  .node-port {
    position: absolute;
    width: #{$portSize}px;
    height: #{$portSize}px;
    left: 50%;
    transform: translate(-50%);
    border: 1px solid #ccc;
    border-radius: 100px;
    background: white;
    &:hover {
      background: $themeColor;
      border: 1px solid $themeColor;
    }
  }
  .node-input {
    top: #{-2 + $portSize/-2}px;
  }
  .node-output {
    bottom: #{-2 + $portSize/-2}px;
  }
  .node-delete {
    position: absolute;
    right: -6px;
    top: -6px;
    font-size: 12px;
    width: 12px;
    height: 12px;
    color: $themeColor;
    cursor: pointer;
    background: white;
    border: 1px solid $themeColor;
    border-radius: 100px;
    text-align: center;
    &:hover {
      background: $themeColor;
      color: white;
    }
  }
}
.selected {
  box-shadow: 0 0 0 2px $themeColor;
}
</style>
