import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/utils/db';
import { getServerSession } from 'next-auth';
import { departments } from '@/utils/seedlolol/data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { description, photo } = await request.json();
  const session = await getServerSession();
  const reporterName = session?.user?.name || "Anonymous";

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that analyzes incident reports and determines the appropriate department to handle the issue. Use only the following departments :
            ${departments.map((dept) =>
              `${dept.name}`
            ).join('\n')}
          Respond with only the department name.`
        },
        {
          role: "user",
          content: `Analyze this incident report and determine the appropriate department and sub-department: ${description}`
        }
      ],
    });

    const result = response.choices[0].message?.content;
    const [department] = result?.split(',').map((item: string) => item.trim()) || [];

    const report = await db.communityReport.create({
      data: {
        image: photo,
        reporterName,
        issue: description,
        status: "New",
        department,
      },
    });

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error('Error analyzing report:', error);
    return NextResponse.json({ error: 'Failed to analyze report' }, { status: 500 });
  }
}
