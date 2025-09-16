import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserSubmission from "@/lib/models/UserSubmission";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    // Add better error handling for JSON parsing
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { finalPassword } = body;
    const { id } = await params;

    // Validate required fields
    if (!finalPassword) {
      return NextResponse.json({ error: "Missing finalPassword" }, { status: 400 });
    }

    // Validate ObjectId format
    if (!id || id.length !== 24) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }

    const user = await UserSubmission.findByIdAndUpdate(
      id,
      {
        finalPassword,
        completed: true,
        completedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        level: user.level,
        term: user.term,
        dept: user.dept,
        email: user.email,
        completed: user.completed,
        finalPassword: user.finalPassword,
        completedAt: user.completedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating user submission:", error);
    return NextResponse.json({ error: "Failed to update user submission" }, { status: 500 });
  }
}
