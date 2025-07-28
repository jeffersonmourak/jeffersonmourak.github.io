import { parse } from "@std/toml";

export async function fetchFileContent(filename?: string): Promise<string> {
  if (!filename) {
    throw new Error("Filename is required");
  }

  const file = Bun.file(filename);
  const exists = await file.exists();

  if (!exists) {
    throw new Error(`File not found: ${filename}`);
  }

  return await file.text();
}

type ConfigFile = {
  file?: string;
  probe?: {
    address: number;
    value: number;
  }[];
};

export async function fetchConfigFile(): Promise<ConfigFile> {
  const configFile = Bun.file("circ.config.toml");

  const exists = await configFile.exists();
  if (!exists) {
    throw new Error("Configuration file not found: circ.config.toml");
  }

  const content = await configFile.text();

  return parse(content) as ConfigFile;
}
