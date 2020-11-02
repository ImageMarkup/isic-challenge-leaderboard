import leaderboardStore from './store';

export default function leaderboardPlugin(store) {
  store.registerModule('leaderboard', leaderboardStore);
}
