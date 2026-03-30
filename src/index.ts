async function main() {
  if (process.argv.length !== 3) {
    console.log("Wrong argument number");
    process.exit(1);
  }
  const baseURL = process.argv[2];
  console.log("Starting craweler for " + baseURL);
  try {
    const text = await getHTML(baseURL);
    console.log(text);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

async function getHTML(url: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "BootCrawler/1.0",
    },
  });
  if (response.status !== 200) {
    throw new Error("Failed to fetched, status code: " + response.status);
  }
  if (response.headers.get("content-type") !== "text/html") {
    throw new Error("Content type is not text/html");
  }

  return response.text();
}
