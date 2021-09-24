export const math = (function() {
  return {
    rand_range: function(a, b) {
      return Math.random() * (b - a) + a;
    },

    rand_int: function(a, b) {
      return Math.round(Math.random() * (b - a) + a);
    }
  };
})();
