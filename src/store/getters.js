import { countObjectProperties } from "../utils";

export default {
  authUser(state) {
    return state.authId ? state.users[state.authId] : null;
  },
  userPostsCount: state => id => countObjectProperties(state.users[id].posts), // dynamic getter
  userThreadsCount: state => id => countObjectProperties(state.users[id].threads), // dynamic getter
  threadRepliesCount: state => id => countObjectProperties(state.threads[id].posts) - 1,
  threadContributorsCount: state => id => countObjectProperties(state.threads[id].contributors)
};
