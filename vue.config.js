module.exports = {
    css: {
      loaderOptions: {
        sass: {
            additionalData: `
            @import "@/scss/utils/_normalize.scss";
            @import "@/scss/utils/_fonts.scss";
            @import "@/scss/utils/_scrollbas.scss";
            @import "@/scss/global/_variables.scss";
            @import "@/scss/global/_header.scss";
            @import "@/scss/global/_filters.scss";
            @import "@/scss/global/_videos.scss";
            @import "@/scss/modals/_generic.scss";
            @import "@/scss/modals/_champions.scss";
            @import "@/scss/modals/_ranks.scss";
            @import "@/scss/modals/_roles.scss";
            @import "@/scss/modals/_sources.scss";
            @import "@/scss/modals/_tags.scss";
            @import "@/scss/modals/_signin.scss";
            @import "@/scss/global/_video.scss";
            @import "@/scss/global/_untagged.scss";
            @import "@/scss/global/_menu.scss";
            @import "@/scss/modals/_reported.scss";
            @import "@/scss/global/_white.scss";
            @import "@/scss/global/_cookies.scss";
          `
        }
      }
    }
  };