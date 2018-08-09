<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <textarea name="" id="" cols="30" rows="10" class="form-input" v-model='text'></textarea>
    </div>
    <div class="form-actions">
      <button v-if="isUpdate" @click.prevent="cancel" class="btn btn-ghost">Cancel</button>
      <button class="btn-blue">{{!!post ? 'Update' : 'Submit post'}}</button>
    </div>
  </form>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters({
      user: "auth/authUser"
    }),
    isUpdate() {
      return !!this.post;
    }
  },
  props: {
    threadId: {
      required: false,
      type: String
    },
    post: {
      type: Object,
      validator: obj => {
        const keyIsValid = typeof obj[".key"] === "string";
        const textIsValid = typeof obj.text === "string";
        const valid = keyIsValid && textIsValid;

        if (!valid) {
          console.error("The post prop object must include a `.key` and `text` attributes.");
        }

        return valid;
      }
    }
  },
  data() {
    return {
      text: this.post ? this.post.text : ""
    };
  },
  methods: {
    ...mapActions("posts", ["createPost", "updatePost"]),
    cancel() {
      this.$emit("cancel");
    },
    create() {
      const post = {
        text: this.text,
        threadId: this.threadId
        // userId: this.user[".key"]
      };

      // vue cannot detect when object properties are added or removed, so the following is not reactive.
      // this.$store.state.posts[postId] = post;
      // this.thread.posts[postId] = postId;

      // this is how to change objects and ensure that vue is aware
      // Vue.set(obj, propertyName, value) -> this.$set(obj, propertyName, value)
      // this.$set(this.$store.state.posts, postId, post);

      this.text = "";
      return this.ceatePost(post); // as update() and create() both emit the same event and payload, move the emit to save()
    },
    update() {
      const payload = {
        id: this.post[".key"],
        text: this.text
      };

      // this.$store.dispatch("updatePost", payload).then(post => {
      //   this.$emit("save", { post });
      // });
      return this.updatePost(payload); // return the promise to save()
    },
    persist() {
      return this.isUpdate ? this.update() : this.create();
    },
    save() {
      this.persist().then(post => {
        this.$emit("save", { post });
      });
    }
  }
};
</script>

<style>
</style>
