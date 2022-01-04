if (process.env.NODE_ENV === "development") {
  import("@welldone-software/why-did-you-render")
    .catch();
}
