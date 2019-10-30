import leaderboardStore from './store';

export default function (store) {
  store.registerModule('leaderboard', leaderboardStore);
}
