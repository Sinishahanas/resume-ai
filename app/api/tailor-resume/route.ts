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

    if (!(resume instanceof File) || typeof jobDescription !== "string") {
      return NextResponse.json(
        { error: "Resume and job description are required." },
        { status: 400 },
      );
    }

    if (resume.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Please upload a PDF resume." },
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

    let resumeText: string;

    try {
      const result = await parser.getText();
      resumeText = result.text;
    } finally {
      await parser.destroy();
    }

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from this PDF." },
        { status: 400 },
      );
    }

    const prompt = `

You are an expert ATS resume strategist and professional resume writer.

Your task is to create a highly job-specific resume by tailoring the candidate's original resume to the exact target job description.

ORIGINAL RESUME:
${resumeText}

TARGET JOB DESCRIPTION:
${jobDescription}

IMPORTANT: DO NOT simply reformat or summarize the original resume. You must actively tailor its content to the target job.

STEP 1: UNDERSTAND THE JOB
- Identify the target job title and responsibilities.
- Identify required and preferred technical skills.
- Identify relevant experience, qualifications and industry requirements.
- Identify important ATS keywords.

STEP 2: MATCH THE CANDIDATE'S EXPERIENCE
- Compare every important job requirement against the original resume.
- Identify which existing skills, projects, responsibilities and achievements are relevant.
- Prioritize the most relevant actual experience.
- Identify requirements that the candidate does not meet.

STEP 3: GENERATE A TAILORED RESUME

Professional Title:
- Use a suitable title aligned with the target role.
- Do not claim a seniority or specialization unsupported by the original resume.

Professional Summary:
- Rewrite specifically for the target job.
- Highlight the candidate's most relevant actual experience.
- Use relevant terminology from the job description when supported by the resume.

Skills:
- Prioritize skills that match the job requirements.
- Group relevant skills logically.
- Never add unsupported skills.

Work Experience:
- Rewrite existing responsibilities to emphasize their relevance to the target job.
- Use strong professional action verbs.
- Prioritize the most relevant responsibilities.
- Preserve company names, job titles, locations and employment dates.
- Do not invent achievements, metrics or responsibilities.

Projects:
- Prioritize projects relevant to the target job.
- Explain their actual technologies and contributions clearly.
- Never create fictional projects.

Education and Certifications:
- Preserve the original qualifications and certification details.

STRICT FACTUAL ACCURACY RULES:
1. Never invent qualifications, degrees, certifications, experience, projects, skills or achievements.
2. Never claim experience with a technology just because it appears in the job description.
3. Never change employer names, job titles or employment dates.
4. Never invent numerical achievements or performance improvements.
5. Preserve personal details and contact information.
6. Do not misrepresent the candidate's experience to satisfy job requirements.
7. If a required skill is missing, do not include it as an existing skill.
8. Improve wording and presentation without changing the underlying facts.

TAILORING PRIORITY:
The final resume must be specifically relevant to the supplied job description, not a generic version of the original resume.

Use the candidate's genuine experience to demonstrate transferable skills wherever possible.

Return ONLY valid JSON using this exact structure:

{
  "fullName": "",
  "contact": {
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "professionalTitle": "",
  "professionalSummary": "",
  "skills": [
    {
      "category": "",
      "items": []
    }
  ],
  "experience": [
    {
      "jobTitle": "",
      "company": "",
      "location": "",
      "dates": "",
      "highlights": []
    }
  ],
  "projects": [
    {
      "name": "",
      "technologies": [],
      "highlights": []
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "dates": "",
      "details": []
    }
  ],
  "certifications": [],
  "languages": []
}

Include only sections supported by the original resume.
Do not include markdown code fences or explanatory text outside the JSON.

`;

    const aiResponse = await gemini.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    const aiText = aiResponse.text;

    if (!aiText) {
      throw new Error("Gemini returned an empty response.");
    }

    const cleanedText = aiText
      .replace(/^```json\s*/i, "")
      .replace(/\s*```$/, "");

    const tailoredResume = JSON.parse(cleanedText);

    return NextResponse.json({
      message: "Tailored resume generated successfully!",
      tailoredResume,
    });
  } catch (error) {
    console.error("Tailored resume error:", error);

    return NextResponse.json(
      { error: "Unable to generate tailored resume. Please try again." },
      { status: 500 },
    );
  }
}
