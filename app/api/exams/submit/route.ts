import { NextResponse } from "next/server";
import { Exam } from "@/app/models/Exam";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  await dbConnect();
  const { examId, answers } = await req.json();

  // Fetch the exam from the database
  const exam = await Exam.findById(examId);
  if (!exam) {
    return NextResponse.json({ message: "Exam not found" }, { status: 404 });
  }

  let score = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exam.examQuestions.forEach((q: any, i: number) => {
    if (answers[i] === q.correctAnswer) score += q.points || 1;
  });

  return NextResponse.json({ score, total: exam.examQuestions.length });
}