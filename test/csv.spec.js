import { describe, it, expect } from "vitest";
import { escapeCsvValue, buildCsv } from "../src/lib/csv";

describe("CSV utils", () => {
  it("escapes quotes properly", () => {
    expect(escapeCsvValue('hello')).toBe('"hello"');
    expect(escapeCsvValue('a"b')).toBe('"a""b"');
  });

  it("builds CSV with headers and rows", () => {
    const headers = ["Order ID", "User", "Total"];
    const rows = [
      { "Order ID": "abc", User: "john", Total: 1000 },
      { "Order ID": "def", User: "mary", Total: 2000 },
    ];
    const csv = buildCsv(rows, headers);
    const lines = csv.split('\n');
    expect(lines[0]).toBe(headers.join(","));
    expect(lines.length).toBe(3);
    expect(lines[1]).toContain('"abc"');
  });
});
