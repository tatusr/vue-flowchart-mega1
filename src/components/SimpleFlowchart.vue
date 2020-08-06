<template>
  <div
    class="flowchart-container"
    @mousemove="handleMove"
    @mouseup="handleUp"
    @mousedown="handleDown"
    @mousewheel="zoom"
    :style="style"
  >
    <svg width="100%" :height="`${height}px`">
      <flowchart-link
        v-bind.sync="link"
        v-for="(link, index) in lines"
        :key="`link${index}`"
        @deleteLink="linkDelete(link.id)"
      ></flowchart-link>
    </svg>
    <flowchart-node
      v-bind.sync="node"
      v-for="(node, index) in nodes"
      :key="`node${index}`"
      :options="nodeOptions"
      @linkingStart="linkingStart(node._id)"
      @linkingStop="linkingStop(node._id)"
      @nodeClick="nodeClick(node._id, $event)"
    ></flowchart-node>
  </div>
</template>

<script>
import FlowchartLink from "./FlowchartLink.vue";
import FlowchartNode from "./FlowchartNode.vue";
import { getMousePosition } from "../utils/position";

export default {
  name: "VueFlowchart",
  props: {
    scene: {
      type: Object,
      default() {
        return {
          centerX: 1024,
          scale: 1,
          centerY: 140,
          mainScale: 1,
          nodes: []
        };
      }
    },
    // links: {
    //   type: Array,
    //   default() {
    //     return [];
    //   },
    // },

    nodes: {
      type: Array,
      default() {
        return [];
      }
    },
    height: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      action: {
        linking: false,
        dragging: false,
        moving: false,
        scrolling: false,
        selected: 0
      },
      mouse: {
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0
      },
      draggingLink: null,
      rootDivOffset: {
        top: 0,
        left: 0
      }
    };
  },
  components: {
    FlowchartLink,
    FlowchartNode
  },
  computed: {
    style() {
      return {};
      // Apply scale transform
      //return { transform: `scale(${this.scene.mainScale})`}
    },
    nodeOptions() {
      return {
        centerY: this.scene.centerY,
        centerX: this.scene.centerX,
        scale: this.scene.scale,
        offsetTop: this.rootDivOffset.top,
        offsetLeft: this.rootDivOffset.left,
        selected: this.action.selected
      };
    },
    lines() {
      var lines = [];
      this.nodes.forEach(node => {
        if (node.children) {
          node.children.forEach(child => {
            const fromNode = node;
            const toNode = this.findNodeWithID(child);
            let cy, cx, ex, ey;
            [cx, cy] = this.getPortPosition("bottom", fromNode);
            [ex, ey] = this.getPortPosition("top", toNode);
            const line = {
              parentNode: fromNode,
              childNode: toNode,
              start: [cx, cy],
              end: [ex, ey],
              id: fromNode._id + toNode._id
            };
            lines.push(line);
          });
        }
      });

      //console.log(lines);
      if (this.draggingLink) {
        let cy, cx;
        const fromNode = this.findNodeWithID(this.draggingLink.from);
        [cx, cy] = this.getPortPosition("bottom", fromNode);
        // push temp dragging link, mouse cursor postion = link end postion
        lines.push({
          start: [cx, cy],
          end: [this.draggingLink.mx, this.draggingLink.my]
        });
      }
      return lines;
    }
  },
  mounted() {
    //window.addEventListener('mousewheel', this.zoom)
    this.rootDivOffset.top = this.$el ? this.$el.offsetTop : 0;
    this.rootDivOffset.left = this.$el ? this.$el.offsetLeft : 0;
    // console.log(22222, this.rootDivOffset);
  },
  beforeDestroy() {
    //window.removeEventListener('mousewheel', this.zoom)
  },
  methods: {
    findNodeWithID(idStr) {
      return this.nodes.find(item => {
        return idStr === item._id;
      });
    },
    getPortPosition(type, node) {
      let x, y;
      x = this.scene.centerX + node.x * this.scene.scale;
      y = this.scene.centerY + node.y * this.scene.scale;
      if (type === "top") {
        return [x + (node.width / 2) * this.scene.scale, y];
      } else if (type === "bottom") {
        return [
          x + (node.width / 2) * this.scene.scale,
          y + (node.height / 2) * this.scene.scale
        ];
      }
    },
    linkingStart(index) {
      this.action.linking = true;
      this.draggingLink = {
        from: index,
        mx: 0,
        my: 0
      };
    },
    linkingStop(index) {
      // add new Link
      console.log("linkingStop", this.draggingLink, index);
      if (this.draggingLink && this.draggingLink.from !== index) {
        console.log("linkingStop2");
        // check link existence
        // const existed = this.links.find(link => {
        //   return link.from === this.draggingLink.from && link.to === index;
        // });

        const existed = this.nodes.find(node => {
          //console.log("existed", node)
          // if (node.children){
          // var childIndex = node.children.find(child =>{ return child === index}) ;
          // //console.log("childIndex", childIndex)
          // }
          return (
            node._id === this.draggingLink.from &&
            node.children &&
            node.children.find(child => {
              return child === index;
            })
          );
        });
        console.log("linkingStop......", existed);

        if (!existed) {
          console.log("adding......", this.draggingLink);
          const nodeParent = this.findNodeWithID(this.draggingLink.from);
          if (nodeParent) {
            console.log("existed2......", nodeParent);
            nodeParent.children.push(index);
            console.log("added......", nodeParent);
            this.$emit("linkEvent", nodeParent);
          }
        }
      }
      this.draggingLink = null;
    },
    linkDelete(id) {
      console.log("linkDelete", id, this.lines);

      const deletedLink = this.lines.find(item => {
        return item.id === id;
      });
      if (deletedLink) {
        console.log(deletedLink);
        const mainNode = this.nodes.find(node => {
          return node._id === deletedLink.parentNode._id;
        });
        console.log(mainNode);
        if (mainNode && mainNode.children) {
          mainNode.children = mainNode.children.filter(item => {
            return item !== deletedLink.childNode._id;
          });
          console.log(mainNode);
          this.$emit("linkEvent", mainNode);
        }
      }
    },
    nodeClick(id, e) {
      console.log("nodeClick", id);
      console.log(this.nodes);
      this.action.dragging = id;
      this.action.selected = id;
      const nodeSel = this.nodes.find(node => {
        return node._id === id;
      });
      this.$emit("nodeClick", nodeSel);
      this.mouse.lastX =
        e.pageX || e.clientX + document.documentElement.scrollLeft;
      this.mouse.lastY =
        e.pageY || e.clientY + document.documentElement.scrollTop;
    },
    handleMove(e) {
      if (this.action.linking) {
        [this.mouse.x, this.mouse.y] = getMousePosition(this.$el, e);
        [this.draggingLink.mx, this.draggingLink.my] = [
          this.mouse.x,
          this.mouse.y
        ];
      }
      if (this.action.dragging) {
        this.mouse.x =
          e.pageX || e.clientX + document.documentElement.scrollLeft;
        this.mouse.y =
          e.pageY || e.clientY + document.documentElement.scrollTop;
        let diffX = this.mouse.x - this.mouse.lastX;
        let diffY = this.mouse.y - this.mouse.lastY;

        this.mouse.lastX = this.mouse.x;
        this.mouse.lastY = this.mouse.y;

        this.action.moving = true;
        this.moveSelectedNode(diffX, diffY);
      }
      if (this.action.scrolling) {
        [this.mouse.x, this.mouse.y] = getMousePosition(this.$el, e);
        let diffX = this.mouse.x - this.mouse.lastX;
        let diffY = this.mouse.y - this.mouse.lastY;

        this.mouse.lastX = this.mouse.x;
        this.mouse.lastY = this.mouse.y;

        this.scene.centerX += diffX;
        this.scene.centerY += diffY;

        // this.hasDragged = true
      }
    },
    handleUp(e) {
      const target = e.target || e.srcElement;
      console.log("handleUp", target, this.action);
      if (this.$el.contains(target)) {
        if (
          typeof target.className !== "string" ||
          target.className.indexOf("node-input") < 0
        ) {
          this.draggingLink = null;
          if (this.action.moving) {
            this.nodeMoved(this.action.dragging);
          } else if (
            typeof target.className === "string" &&
            target.className.indexOf("node-title") > -1
          ) {
            const nodeSel = this.nodes.find(node => {
              return node._id === this.action.dragging;
            });
            this.$emit("nodeSelected", nodeSel);
          }
        }
        if (
          typeof target.className === "string" &&
          target.className.indexOf("node-delete") > -1
        ) {
          // console.log('delete2', this.action.dragging);
          this.nodeDelete(this.action.dragging);
        }
      }
      this.action.linking = false;
      this.action.dragging = null;
      this.action.scrolling = false;
      this.action.moving = false;
    },
    handleDown(e) {
      const target = e.target || e.srcElement;
      // console.log('for scroll', target, e.keyCode, e.which)
      if (
        (target === this.$el || target.matches("svg, svg *")) &&
        e.which === 1
      ) {
        this.action.scrolling = true;
        [this.mouse.lastX, this.mouse.lastY] = getMousePosition(this.$el, e);
        this.action.selected = null; // deselectAll
      }
      this.$emit("canvasClick", e);
    },
    zoom(event) {
      console.log("zoom", event);
      event.stopPropagation();
      event.preventDefault();
      this.scene.scale += event.deltaY * -0.001;
      console.log("zoom", this.scene.scale, event.deltaY);

      // Restrict scale
      this.scene.scale = Math.min(Math.max(0.125, this.scene.scale), 4);
      console.log("zoom", this.scene.scale, event.deltaY);
    },
    moveSelectedNode(dx, dy) {
      let index = this.nodes.findIndex(item => {
        return item._id === this.action.dragging;
      });
      let left = this.nodes[index].x + dx / this.scene.scale;
      let top = this.nodes[index].y + dy / this.scene.scale;
      this.$set(
        this.nodes,
        index,
        Object.assign(this.nodes[index], {
          x: left,
          y: top
        })
      );
      if (this.nodes[index].children) {
        this.nodes[index].children.forEach(child => {
          const childNodeIndex = this.nodes.findIndex(item => {
            return item._id === child;
          });
          if (childNodeIndex) {
            let leftChild =
              this.nodes[childNodeIndex].x + dx / this.scene.scale;
            let topChild = this.nodes[childNodeIndex].y + dy / this.scene.scale;
            this.$set(
              this.nodes,
              childNodeIndex,
              Object.assign(this.nodes[childNodeIndex], {
                x: leftChild,
                y: topChild
              })
            );
          }
        });
      }
    },
    nodeDelete(id) {
      console.log("nodeDelete");
      const delNode = this.nodes.find(node => node._id === id);
      const newNodes = this.nodes.filter(node => {
        return node._id !== id;
      });
      // this.links = this.links.filter(link => {
      //   return link.from !== id && link.to !== id;
      // });
      this.$emit("update:nodes", newNodes);
      console.log("nodeDelete", delNode);

      this.$emit("nodeDelete", delNode);
    },
    nodeMoved(id) {
      console.log("nodeMoved");
      const movNode = this.nodes.find(node => node._id === id);

      this.$emit("nodeMoved", movNode);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.flowchart-container {
  margin: 0;
  background: #ddd;
  position: relative;
  overflow: hidden;
  svg {
    cursor: grab;
  }
}
</style>
