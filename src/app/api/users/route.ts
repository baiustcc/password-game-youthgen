import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserSubmission from "@/lib/models/UserSubmission";

export async function POST(request: NextRequest) {
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

    const { name, level, term, dept, email } = body;

    // Validate required fields
    if (!name || !level || !term || !dept || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await UserSubmission.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "A submission with this email already exists" }, { status: 400 });
    }

    // Create new user submission
    const userSubmission = new UserSubmission({
      name,
      level,
      term,
      dept,
      email,
      completed: false,
    });

    await userSubmission.save();

    return NextResponse.json({
      success: true,
      user: {
        id: userSubmission._id,
        name: userSubmission.name,
        level: userSubmission.level,
        term: userSubmission.term,
        dept: userSubmission.dept,
        email: userSubmission.email,
        completed: userSubmission.completed,
        createdAt: userSubmission.createdAt,
        updatedAt: userSubmission.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error creating user submission:", error);
    return NextResponse.json({ error: "Failed to create user submission" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let query = {};
    if (email) {
      query = { email: email };
    }

    const users = await UserSubmission.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
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
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
