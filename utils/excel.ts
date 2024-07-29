import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai";
import { z } from "zod";
import * as xlsx from "node-xlsx";

type Extraction = Partial<z.infer<typeof AssetSchema>>;

interface CustomSheet {
  name: string;
  data: (string | number)[][];
}

const AssetSchema = z.object({
  data: z.array(
    z.object({
      name: z.string().optional().nullable(),
      type: z.string().optional().nullable(),
      location: z.string().optional().nullable(),
      purchaseDate: z.date().optional().nullable(),
      lastMaintenance: z.date().optional().nullable(),
      status: z.string().optional().nullable(),
      departmentId: z.number().int().optional().nullable(),
      buyPrice: z.number().optional().nullable(),
      maintenancePrice: z.number().optional().nullable(),
      replacementPrice: z.number().optional().nullable(),
      latitude: z.number().optional().nullable(),
      longitude: z.number().optional().nullable(),
    })
  ),
});

const configuration = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = Instructor({
  client: configuration,
  mode: "FUNCTIONS",
});

async function extractAssetData(text: string): Promise<any> {
  const responseStream = await client.chat.completions.create({
    messages: [{ role: "user", content: text }],
    model: "gpt-4o-mini",
    response_model: { schema: AssetSchema, name: "Asset" },
    stream: true,
    stream_options: {
      include_usage: true,
    },
    seed: 1,
  });

  let extraction: Extraction = {};

  for await (const result of responseStream) {
    try {
      extraction = result;
    } catch (e) {
      console.log(e);
      break;
    }
  }

  return extraction;
}

export function readExcel(buffer: Buffer): string {
  const obj: CustomSheet[] = xlsx.parse(buffer) as CustomSheet[];

  let rows: (string | number)[][] = [];
  obj.forEach((sheet) => {
    sheet.data.forEach((row) => {
      rows.push(row);
    });
  });

  return rows.map((row) => row.join(",")).join("\n");
}

export async function processExcelData(buffer: Buffer) {
  const excelData = readExcel(buffer);
  return await extractAssetData(excelData);
}