import { NextRequest } from 'next/server';
import { Exam } from '@/app/models/Exam';
import dbConnect from '@/lib/dbConnect';
import { cloudinary } from '@/lib/cloudinary';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { title, pictureBase64, examQuestions } = body;

    if (!title || !pictureBase64 || !Array.isArray(examQuestions)) {
      return new Response(JSON.stringify({ message: 'Missing or invalid input data' }), { status: 400 });
    }

    if (!pictureBase64.startsWith('data:image')) {
      return new Response(JSON.stringify({ message: 'Invalid image format for exam picture' }), { status: 400 });
    }

    const uploadedPicture = await cloudinary.uploader.upload(pictureBase64, {
      folder: 'exams'
    });

    const updatedQuestions = await Promise.all(
      examQuestions.map(async (q: any) => {
        if (q.image && typeof q.image === 'string' && q.image.startsWith('data:image')) {
          try {
            const uploadedQuestionImg = await cloudinary.uploader.upload(q.image, {
              folder: 'exam-questions'
            });
            q.image = uploadedQuestionImg.secure_url;
          } catch (err) {
            console.error(`Failed to upload question image for: ${q.questionName || 'unnamed question'}`, err);
            q.image = undefined;
          }
        }
        return q;
      })
    );

    const newExam = new Exam({
      title,
      picture: uploadedPicture.secure_url,
      examQuestions: updatedQuestions
    });

    await newExam.save();

    return new Response(JSON.stringify({ message: 'Exam created successfully', exam: newExam }), { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ message: 'Server error', error }), { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    // Check for ?id=EXAM_ID
    const id = searchParams.get('id');
    if (id) {
      const exam = await Exam.findById(id);
      if (!exam) {
        return new Response(JSON.stringify({ message: 'Exam not found' }), { status: 404 });
      }
      return new Response(JSON.stringify({ exam }), { status: 200 });
    }

    // Otherwise, support search by title
    const search = searchParams.get('q');
    const query = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const exams = await Exam.find(query).sort({ createdAt: -1 });

    return new Response(JSON.stringify({ exams }), { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ message: 'Server error', error }), { status: 500 });
  }
}