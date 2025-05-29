import { NextRequest, NextResponse } from 'next/server';
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
		// Add this log to check the schema Mongoose is using
		console.log("Runtime Exam schema paths:", Object.keys(Exam.schema.paths));

		const body = await request.json();
		console.log("API POST /api/exams - Received body:", body);
		const { title, pictureBase64, examQuestions, duration } = body;
		console.log("API POST /api/exams - Destructured duration:", duration);

		if (!title || !Array.isArray(examQuestions)) { // pictureBase64 can be optional if we allow exams without cover
			return new Response(JSON.stringify({ message: 'Missing or invalid input data for title or questions' }), { status: 400 });
		}

		let uploadedPictureSecureUrl;
		if (pictureBase64) {
			if (!pictureBase64.startsWith('data:image')) {
				return new Response(JSON.stringify({ message: 'Invalid image format for exam picture' }), { status: 400 });
			}
			const uploadedPicture = await cloudinary.uploader.upload(pictureBase64, {
				folder: 'exams'
			});
			uploadedPictureSecureUrl = uploadedPicture.secure_url;
		}


		const updatedQuestions = await Promise.all(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			examQuestions.map(async (q: any) => {
				if (q.image && typeof q.image === 'string' && q.image.startsWith('data:image')) { // New image to upload
					try {
						const uploadedQuestionImg = await cloudinary.uploader.upload(q.image, {
							folder: 'exam-questions'
						});
						q.image = uploadedQuestionImg.secure_url;
					} catch (err) {
						console.error(`Failed to upload question image for: ${q.questionName || 'unnamed question'}`, err);
						q.image = undefined; // Or handle error as needed
					}
				}
				// If q.image is already a URL (from edit mode, no change), it will be passed as is.
				// If q.image is undefined, it means no image or image removed.
				return q;
			})
		);

		const examDataToSave = {
			title,
			picture: uploadedPictureSecureUrl,
			examQuestions: updatedQuestions,
			duration: duration !== undefined && duration !== null && !isNaN(parseInt(String(duration))) ? parseInt(String(duration)) : 30,
		};
		console.log("API POST /api/exams - Exam data to save:", examDataToSave);

		const newExam = new Exam(examDataToSave);

		await newExam.save();
		console.log("API POST /api/exams - Saved exam:", newExam);

		return new Response(JSON.stringify({ message: 'Exam created successfully', exam: newExam }), { status: 201 });
	} catch (error) {
		console.error('Server error POST:', error);
		const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred';
		return new Response(JSON.stringify({ message: 'Server error', error: errorMessage }), { status: 500 });
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

export async function PUT(request: NextRequest) {
	try {
		await dbConnect();
		// Add this log to check the schema Mongoose is using
		console.log("Runtime Exam schema paths (PUT):", Object.keys(Exam.schema.paths));

		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (!id) {
			return new NextResponse(JSON.stringify({ message: 'Exam ID is required for update' }), { status: 400 });
		}

		const existingExam = await Exam.findById(id);
		if (!existingExam) {
			return new NextResponse(JSON.stringify({ message: 'Exam not found' }), { status: 404 });
		}

		const body = await request.json();
		console.log("API PUT /api/exams - Received body:", body);
		const { title, pictureBase64, examQuestions, existingPictureURL, duration } = body;
		console.log("API PUT /api/exams - Destructured duration:", duration);


		let pictureToUpdate = existingExam.picture; // Default to existing picture

		if (pictureBase64 && pictureBase64.startsWith('data:image')) {
			// New image uploaded, upload to Cloudinary
			// Optionally: delete old image from Cloudinary if public_id was stored
			const uploadedPicture = await cloudinary.uploader.upload(pictureBase64, {
				folder: 'exams'
			});
			pictureToUpdate = uploadedPicture.secure_url;
		} else if (pictureBase64 === null || pictureBase64 === undefined && !existingPictureURL) {
			// Image explicitly removed or no new image and no existing URL sent (means remove)
			// Optionally: delete old image from Cloudinary
			pictureToUpdate = undefined;
		}
		// If existingPictureURL is provided and no new pictureBase64, pictureToUpdate remains existingExam.picture (implicitly handled)


		const updatedQuestions = await Promise.all(
			(examQuestions || []).map(async (q: any) => {
				let imageToUpdate = q.image; // This could be an existing URL or undefined
				if (q.image && typeof q.image === 'string' && q.image.startsWith('data:image')) {
					// New image for this question
					const uploadedQuestionImg = await cloudinary.uploader.upload(q.image, {
						folder: 'exam-questions'
					});
					imageToUpdate = uploadedQuestionImg.secure_url;
				} else if (q.image === undefined) {
					// Image was removed for this question
					imageToUpdate = undefined;
				}
				// If q.image is an existing URL, it's passed as is, so imageToUpdate is already correct.
				return {
					...q,
					image: imageToUpdate,
				};
			})
		);

		existingExam.title = title || existingExam.title;
		existingExam.picture = pictureToUpdate;
		existingExam.examQuestions = updatedQuestions;

		if (duration !== undefined && duration !== null && !isNaN(parseInt(String(duration)))) {
			existingExam.duration = parseInt(String(duration));
		}
		// No 'else' needed here; if duration is not provided or invalid, existingExam.duration remains unchanged or uses schema default if applicable on a new field.

		console.log("API PUT /api/exams - Exam data to update (before save):", { _id: existingExam._id, title: existingExam.title, duration: existingExam.duration });

		await existingExam.save();
		console.log("API PUT /api/exams - Updated exam:", existingExam);

		return new NextResponse(JSON.stringify({ message: 'Exam updated successfully', exam: existingExam }), { status: 200 });

	} catch (error) {
		console.error('Server error PUT:', error);
		const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred';
		return new NextResponse(JSON.stringify({ message: 'Server error', error: errorMessage }), { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		await dbConnect();
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (!id) {
			return new NextResponse(JSON.stringify({ message: 'Exam ID is required' }), { status: 400 });
		}

		const deletedExam = await Exam.findByIdAndDelete(id);

		if (!deletedExam) {
			return new NextResponse(JSON.stringify({ message: 'Exam not found' }), { status: 404 });
		}

		// Optionally, you might want to delete associated images from Cloudinary here
		// This would require storing public_ids or a more complex setup.
		// For now, we'll just delete the DB record.

		return new NextResponse(JSON.stringify({ message: 'Exam deleted successfully' }), { status: 200 });
	} catch (error) {
		console.error('Server error during DELETE:', error);
		const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
		return new NextResponse(JSON.stringify({ message: 'Server error', error: errorMessage }), { status: 500 });
	}
}