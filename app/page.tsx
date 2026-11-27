"use client";

import JobDescription from "@/components/JobDescription";
import ResumeUpload from "@/components/ResumeUpload";
import { useState, useRef } from "react";

const features = [
  {
    icon: "✦",
    title: "AI Resume Analysis",
    description:
      "Get detailed feedback on your resume using AI-powered analysis.",
  },
  {
    icon: "◎",
    title: "Job Match Score",
    description:
      "Discover how closely your skills match your target job description.",
  },
  {
    icon: "↗",
    title: "Skill Gap Analysis",
    description:
      "Identify missing skills and find areas where you can improve.",
  },
];

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [tailoredResume, setTailoredResume] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <main className="min-h-screen bg-[#fafaff] text-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5 md:px-16">
        <a href="/" className="text-2xl font-bold tracking-tight">
          Resume<span className="text-violet-600">AI</span>
        </a>

        <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <a href="#features" className="hover:text-violet-600">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-violet-600">
            How it works
          </a>
        </div>

        <a
          href="#analyzer"
          className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Get Started
        </a>
      </nav>

      {/* Hero */}
      <section className="px-6 pb-16 pt-20 text-center md:px-16 md:pt-28">
        <div className="mx-auto mb-6 w-fit rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
          ✦ AI-powered career assistant
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          Make your resume
          <span className="text-violet-600"> stand out.</span>
          <br />
          Get your dream job.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">
          Analyze your resume, match your skills with job requirements, and
          discover opportunities to improve your chances of getting hired.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="#analyzer"
            className="rounded-xl bg-violet-600 px-7 py-4 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
          >
            Analyze My Resume →
          </a>

          <a
            href="#features"
            className="rounded-xl border border-slate-200 bg-white px-7 py-4 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Explore Features
          </a>
        </div>

        <p className="mt-5 text-sm text-slate-400">
          Smart resume insights · AI-powered job matching
        </p>
      </section>

      {/* Analyzer preview */}
      <section id="analyzer" className="px-6 pb-24 md:px-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Start your resume analysis</h2>
            <p className="mt-2 text-sm text-slate-500">
              Upload your resume and add the job description you want to apply
              for.
            </p>
          </div>

          {/* <div className="rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/50 p-10 text-center">
            <div className="text-4xl">📄</div>
            <h3 className="mt-4 font-semibold">Upload your resume</h3>
            <p className="mt-2 text-sm text-slate-500">
              PDF format · Maximum 5 MB
            </p>
            <p className="mt-4 text-sm font-medium text-violet-600">
              Resume upload functionality coming next
            </p>
          </div> */}
          <ResumeUpload file={resumeFile} onFileChange={setResumeFile} />

          {/* <div className="mt-7">
            <label className="mb-3 block text-sm font-semibold">
              Job Description
            </label>
            <textarea
              placeholder="Paste the job description here..."
              rows={6}
              disabled
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none"
            />
            <p className="mt-2 text-xs text-slate-400">
              We'll enable job description input in the next development step.
            </p>
          </div> */}

          <JobDescription value={jobDescription} onChange={setJobDescription} />

          {/* <button
            type="button"
            disabled={!resumeFile || !jobDescription.trim()}
            onClick={async () => {
              const formData = new FormData();

              formData.append("resume", resumeFile!);
              formData.append("jobDescription", jobDescription);

              try {
                const response = await fetch("/api/analyze", {
                  method: "POST",
                  body: formData,
                });

                const result = await response.json();

                alert(result.message || result.error);
              } catch (error) {
                alert("Something went wrong. Please try again.");
              }
            }}
            className="mt-6 w-full rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Analyze Resume
          </button> */}

          <button
            type="button"
            disabled={!resumeFile || !jobDescription.trim() || isAnalyzing}
            onClick={async () => {
              setIsAnalyzing(true);
              setError("");

              const formData = new FormData();

              formData.append("resume", resumeFile!);
              formData.append("jobDescription", jobDescription);

              try {
                const response = await fetch("/api/analyze", {
                  method: "POST",
                  body: formData,
                });

                const result = await response.json();

                if (!response.ok) {
                  throw new Error(result.error || "Resume analysis failed.");
                }

                // setAnalysis(result.analysis);
                setAnalysis(result.analysis);

                setTimeout(() => {
                  resultsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 100);
              } catch (error) {
                setError(
                  error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again.",
                );
              } finally {
                setIsAnalyzing(false);
              }
            }}
            className="mt-6 w-full rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
          </button>
          {/* {analysis && (
            <div className="mt-8 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Resume Analysis
              </h2>

              <p className="mt-4 text-4xl font-bold text-violet-600">
                {analysis.matchScore}/100
              </p>

              <p className="mt-3 text-sm text-slate-600">{analysis.summary}</p>
            </div>
          )} */}
          {analysis && (
            <div
              ref={resultsRef}
              className="mt-8 scroll rounded-2xl border border-violet-100 bg-white p-6 shadow-sm"
            >
              {/* <h2 className="text-xl font-bold text-slate-900">
                Resume Analysis
              </h2> */}
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-2xl font-bold text-slate-900">
                  Resume Analysis
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  AI-powered insights based on your resume and job description.
                </p>

                <p className="mt-2 text-xs font-medium text-violet-600">
                  Analyzed Resume: {resumeFile?.name}
                </p>
              </div>

              {/* <p className="mt-4 text-4xl font-bold text-violet-600">
                {analysis.matchScore}/100
              </p> */}
              <div className="mt-6 flex flex-col items-center">
                <div
                  className="flex h-36 w-36 items-center justify-center rounded-full"
                  style={{
                    // background: `conic-gradient(#7c3aed ${analysis.matchScore * 3.6}deg, #ede9fe 0deg)`,
                    background: `conic-gradient(${
                      analysis.matchScore >= 70
                        ? "#16a34a"
                        : analysis.matchScore >= 40
                          ? "#f59e0b"
                          : "#dc2626"
                    } ${analysis.matchScore * 3.6}deg, #e5e7eb 0deg)`,
                  }}
                >
                  <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-3xl font-bold text-violet-700">
                      {analysis.matchScore}%
                    </span>
                    <span className="text-xs text-slate-500">Match Score</span>
                  </div>
                </div>

                <p className="mt-3 text-sm font-medium text-slate-600">
                  Job Compatibility
                </p>
              </div>

              {/* <p className="mt-3 text-sm text-slate-600">{analysis.summary}</p> */}
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="font-semibold text-slate-800">AI Summary</h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {analysis.summary}
                </p>
              </div>

              {/* Matched Skills */}
              <div className="mt-6 rounded-xl border border-green-100 bg-green-50/50 p-5">
                <h3 className="font-semibold text-green-700">Matched Skills</h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {analysis.matchedSkills.map(
                    (skill: string, index: number) => (
                      <span
                        key={index}
                        className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                      >
                        {skill}
                      </span>
                    ),
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="mt-6 rounded-xl border border-red-100 bg-red-50/50 p-5">
                <h3 className="font-semibold text-red-700">Missing Skills</h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {analysis.missingSkills.map(
                    (skill: string, index: number) => (
                      <span
                        key={index}
                        className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700"
                      >
                        {skill}
                      </span>
                    ),
                  )}
                </div>
              </div>
              {/* Strengths */}
              <div className="mt-6 rounded-xl border border-green-100 bg-green-50/50 p-5">
                <h3 className="font-semibold text-green-700">Your Strengths</h3>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {analysis.strengths.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="mt-6 rounded-xl border border-orange-100 bg-orange-50/50 p-5">
                <h3 className="font-semibold text-orange-700">
                  Areas to Improve
                </h3>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {analysis.weaknesses.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              {/* AI Recommendations */}
              <div className="mt-6 rounded-xl border border-violet-100 bg-violet-50/50 p-5">
                <h3 className="font-semibold text-violet-700">
                  AI Recommendations
                </h3>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {analysis.recommendations.map(
                    (item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ),
                  )}
                </ul>
              </div>

              {/* Generate Tailored Resume */}
              <div className="mt-8 rounded-xl border border-violet-200 bg-violet-50 p-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Ready to improve your resume?
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Generate a job-specific resume using your existing
                  qualifications and experience.
                </p>

                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={async () => {
                    setIsGenerating(true);
                    setTailoredResume(null);
                    setError("");

                    const formData = new FormData();
                    formData.append("resume", resumeFile!);
                    formData.append("jobDescription", jobDescription);

                    try {
                      const response = await fetch("/api/tailor-resume", {
                        method: "POST",
                        body: formData,
                      });

                      const result = await response.json();

                      if (!response.ok) {
                        throw new Error(
                          result.error || "Resume generation failed.",
                        );
                      }

                      setTailoredResume(result.tailoredResume);
                    } catch (error) {
                      setError(
                        error instanceof Error
                          ? error.message
                          : "Unable to generate tailored resume.",
                      );
                    } finally {
                      setIsGenerating(false);
                    }
                  }}
                  className="mt-5 w-full rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGenerating
                    ? "Generating Resume..."
                    : "✨ Generate Tailored Resume"}
                </button>
              </div>

              {/* Tailored Resume Preview */}
              {tailoredResume && (
                <div className="mt-8 rounded-2xl border border-violet-200 bg-white p-6 shadow-sm">
                  <div className="border-b border-slate-200 pb-5">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {tailoredResume.fullName}
                    </h2>

                    <p className="mt-2 text-lg font-semibold text-violet-700">
                      {tailoredResume.professionalTitle}
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                      {[
                        tailoredResume.contact?.email,
                        tailoredResume.contact?.phone,
                        tailoredResume.contact?.location,
                        tailoredResume.contact?.linkedin,
                      ]
                        .filter(Boolean)
                        .join(" | ")}
                    </p>
                  </div>

                  {/* Professional Summary */}
                  {tailoredResume.professionalSummary && (
                    <div className="mt-6">
                      <h3 className="font-bold text-slate-900">
                        Professional Summary
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {tailoredResume.professionalSummary}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {tailoredResume.skills?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-bold text-slate-900">Skills</h3>

                      {tailoredResume.skills.map(
                        (group: any, index: number) => (
                          <div key={index} className="mt-3">
                            <p className="text-sm font-semibold text-slate-700">
                              {group.category}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {group.items.join(" • ")}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Experience */}
                  {tailoredResume.experience?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-bold text-slate-900">
                        Professional Experience
                      </h3>

                      {tailoredResume.experience.map(
                        (job: any, index: number) => (
                          <div key={index} className="mt-4">
                            <p className="font-semibold text-slate-800">
                              {job.jobTitle} – {job.company}
                            </p>
                            <p className="text-xs text-slate-500">
                              {job.location} {job.dates}
                            </p>

                            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-600">
                              {job.highlights.map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Projects */}
                  {tailoredResume.projects?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-bold text-slate-900">Projects</h3>

                      {tailoredResume.projects.map(
                        (project: any, index: number) => (
                          <div key={index} className="mt-3">
                            <p className="font-semibold text-slate-800">
                              {project.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {project.technologies.join(" • ")}
                            </p>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                              {project.highlights.map(
                                (item: string, i: number) => (
                                  <li key={i}>{item}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Education */}
                  {tailoredResume.education?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-bold text-slate-900">Education</h3>

                      {tailoredResume.education.map(
                        (edu: any, index: number) => (
                          <div key={index} className="mt-3">
                            <p className="font-semibold text-slate-800">
                              {edu.degree}
                            </p>
                            <p className="text-sm text-slate-600">
                              {edu.institution} {edu.dates}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Certifications */}
                  {tailoredResume.certifications?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-bold text-slate-900">
                        Certifications
                      </h3>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                        {tailoredResume.certifications.map(
                          (item: string, index: number) => (
                            <li key={index}>{item}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Languages */}
                  {tailoredResume.languages?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-bold text-slate-900">Languages</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        {tailoredResume.languages.join(" • ")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setAnalysis(null);
                    setResumeFile(null);
                    setJobDescription("");
                    setError("");
                    document.getElementById("analyzer")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="w-full rounded-xl border border-violet-200 px-6 py-3 font-semibold text-violet-700 transition hover:bg-violet-50"
                >
                  Analyze Another Resume
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white px-6 py-20 md:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="font-semibold text-violet-600">FEATURES</p>
            <h2 className="mt-3 text-3xl font-bold">
              Everything you need to improve your resume
            </h2>
            <p className="mt-4 text-slate-500">
              Smart tools to help you prepare for your next career opportunity.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-2xl text-violet-600">
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-lg font-bold">{feature.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-20 md:px-16">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold">How ResumeAI works</h2>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              [
                "01",
                "Upload Resume",
                "Upload your existing resume in PDF format.",
              ],
              [
                "02",
                "Add Job Description",
                "Tell us about the role you want to apply for.",
              ],
              [
                "03",
                "Get AI Insights",
                "Receive your match score and improvement suggestions.",
              ],
            ].map(([number, title, description]) => (
              <div key={number}>
                <div className="text-4xl font-bold text-violet-300">
                  {number}
                </div>
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8 text-center">
        <p className="font-bold">
          Resume<span className="text-violet-600">AI</span>
        </p>
        <p className="mt-2 text-sm text-slate-400">
          AI-powered resume analysis and job matching.
        </p>
        <p className="mt-4 text-xs text-slate-400">
          © 2026 ResumeAI. Built with Next.js and TypeScript.
        </p>
      </footer>
    </main>
  );
}
