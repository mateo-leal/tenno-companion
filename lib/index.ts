import { main } from "./cli/app";

main().catch((error) => {
  console.error(
    `Error: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});
