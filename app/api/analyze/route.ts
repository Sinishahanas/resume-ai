import { NextResponse } from "next/server";
import { getData } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import { gemini } from "@/lib/gemini";

PDFParse.setWorker(getData());

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const resume = formData.get("resume");
    const jobDescription = formData.get("jobDescription");

    if (!(resume instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a valid PDF resume." },
        { status: 400 },
      );
    }

    if (!jobDescription || typeof jobDescription !== "string") {
      return NextResponse.json(
        { error: "Please provide a job description." },
        { status: 400 },
      );
    }

    if (resume.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed." },
        { status: 400 },
      );
    }

    if (resume.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Resume must be smaller than 5MB." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await resume.arrayBuffer());

    const parser = new PDFParse({ data: buffer });

    try {
      const result = await parser.getText();

      if (!result.text.trim()) {
        return NextResponse.json(
          { error: "No readable text found in the PDF." },
          { status: 400 },
        );
      }

      // console.log("Extracted resume text:", result.text);

      // return NextResponse.json({
      //   message: "Resume text extracted successfully!",
      //   fileName: resume.name,
      //   extractedText: result.text,
      //   jobDescriptionLength: jobDescription.length,
      // });
      const prompt = `
You are an expert ATS resume analyzer.

Analyze the candidate's resume against the job description.

RESUME:
${result.text}

JOB DESCRIPTION:
${jobDescription}

Return your analysis in the following JSON format:

{
  "matchScore": 85,
  "summary": "Short overall assessment",
  "matchedSkills": ["React", "Node.js"],
  "missingSkills": ["AWS", "Docker"],
  "strengths": ["Strong frontend experience"],
  "weaknesses": ["Limited cloud experience"],
  "recommendations": ["Add relevant cloud projects"]
}

Give a realistic match score between 0 and 100.
Return only valid JSON without markdown formatting.
`;

      let aiResponse;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          aiResponse = await gemini.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
          });

          break;
        } catch (error) {
          attempts++;

          const status = (error as { status?: number }).status;

          if (status === 503 && attempts < maxAttempts) {
            console.log(`Gemini busy. Retrying attempt ${attempts + 1}...`);

            await new Promise((resolve) =>
              setTimeout(resolve, 2000 * Math.pow(2, attempts - 1)),
            );
          } else {
            throw error;
          }
        }
      }

      if (!aiResponse) {
        throw new Error("Gemini could not generate a response.");
      }

      const aiText = aiResponse.text;

      if (!aiText) {
        throw new Error("Gemini returned an empty response.");
      }

      const analysis = JSON.parse(aiText);

      return NextResponse.json({
        message: "Resume analyzed successfully!",
        fileName: resume.name,
        analysis,
      });
    } finally {
      await parser.destroy();
    }
  } catch (error) {
    console.error("Resume analysis error:", error);

    const status = (error as { status?: number }).status;

    if (status === 503) {
      return NextResponse.json(
        { error: "AI service is currently busy. Please try again shortly." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Resume analysis failed. Please try again." },
      { status: 500 },
    );
  }
}
