function main() {
  if (process.argv.length !== 3) {
    console.log("Wrong argument number");
    process.exit(1);
  }
  const baseURL = process.argv[2];
  console.log("Starting craweler for " + baseURL);
}

main();
