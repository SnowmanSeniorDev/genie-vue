<script>
export default {
  name: "InputTag",
  props: {
    modelValue: {
      type: Array
    },
    value: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ""
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    addTagOnKeys: {
      type: Array,
      default: function() {
        return [
          13, // Return
          188, // Comma ','
          9 // Tab
        ];
      }
    },
    addTagOnBlur: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: -1
    },
    allowDuplicates: {
      type: Boolean,
      default: false
    },
    beforeAdding: {
      type: Function
    }
  },
  data() {
    return {
      newTag: "",
      innerTags: [...this.modelValue],
      isInputActive: false
    };
  },
  computed: {
    isLimit: function() {
      return this.limit > 0 && Number(this.limit) === this.innerTags.length;
    }
  },
  watch: {
    value() {
      this.innerTags = [...this.modelValue];
    }
  },
  methods: {
    focusNewTag() {
      if (this.readOnly || !this.$el.querySelector(".new-tag")) return;
      this.$el.querySelector(".new-tag").focus();
    },
    handleInputFocus() {
      this.isInputActive = true;
    },
    handleInputBlur(e) {
      this.isInputActive = false;
      this.addNew(e);
    },
    async addNew(e) {
      const keyShouldAddTag = e ? this.addTagOnKeys.indexOf(e.keyCode) !== -1 : true;
      const typeIsNotBlur = e && e.type !== "blur";
      if ( (!keyShouldAddTag && (typeIsNotBlur || !this.addTagOnBlur)) || this.isLimit ) return;
      const tag = this.beforeAdding ? await this.beforeAdding(this.newTag) : this.newTag;
      if ( tag && (this.allowDuplicates || this.innerTags.indexOf(tag) === -1)) {
        this.innerTags.push(tag);
        this.newTag = "";
        this.tagChange();
        e && e.preventDefault();
      }
    },
    
    remove(index) {
      this.innerTags.splice(index, 1);
      this.tagChange();
    },
    removeLastTag() {
      if (this.newTag) return;
      this.innerTags.pop();
      this.tagChange();
    },
    tagChange() {
      this.$emit("update:modelValue", this.innerTags);
      this.$emit("input", this.innerTags);
    }
  },
  mounted() {
    console.log("asdfasfasdf = ", this.modelValue)
  }
};
</script>

<template>
  <div
    @click="focusNewTag()"
    :class="{ 'read-only': readOnly, 'vue-input-tag-wrapper--active': isInputActive}"
    class="form-control"
  >
    <span v-for="(tag, index) in innerTags" :key="index" class="input-tag">
      <a v-if="!readOnly" @click.prevent.stop="remove(index)" class="remove">
        <slot name="remove-icon" />
      </a>
      <span>{{ tag }}</span>
    </span>
    <input
      v-if="!readOnly && !isLimit"
      ref="inputtag"
      :placeholder="placeholder"
      type="text"
      v-model="newTag"
      v-on:keydown.delete.stop="removeLastTag"
      v-on:keydown="addNew"
      v-on:blur="handleInputBlur"
      v-on:focus="handleInputFocus"
      class="new-tag"
    />
  </div>
</template>

<style>
.vue-input-tag-wrapper {
  background-color: #fff;
  border: 1px solid #ccc;
  overflow: hidden;
  padding-left: 4px;
  padding-top: 4px;
  cursor: text;
  text-align: left;
  -webkit-appearance: textfield;
  display: flex;
  flex-wrap: wrap;
}
.form-control .input-tag {
  background-color: #e2e8f0;
  border-radius: 2px;
  color: #303438;
  display: inline-block;
  font-size: 13px;
  font-weight: 400;
  margin-right: 4px;
  padding: 0.3em 0.5em 0.3em 0.5em;
}
.form-control .input-tag .remove {
  cursor: pointer;
  color: #303438;
}
.form-control .input-tag .remove:hover {
  text-decoration: none;
}
.form-control .input-tag .remove:empty::before {
  content: "x";
  padding: 0em 0.5em 0em 0.2em;
}
.form-control .new-tag {
  background: transparent;
  border: 0;
  color: #777;
  font-size: 13px;
  font-weight: 400;
  margin-top: 1px;
  outline: none;
  padding: 4px;
  padding-left: 0;
  flex-grow: 1;
}
.form-control.read-only {
  cursor: default;
}
</style>