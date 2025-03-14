import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET function for fetching problems
export async function GET() {
  try {
    const problems = await prisma.problem.findMany();
    return new Response(JSON.stringify(problems), { status: 200 });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch problems" }),
      { status: 500 }
    );
  }
}

// GET function to count problems
export async function GET_COUNT() {
  try {
    const count = await prisma.problem.count();
    return new Response(JSON.stringify({ count }), { status: 200 });
  } catch (error) {
    console.error("Error counting problems:", error);
    return new Response(
      JSON.stringify({ error: "Failed to count problems" }),
      { status: 500 }
    );
  }
}

// POST function for creating problems
export async function POST(req) {
  try {
    const { title, difficulty, solved } = await req.json(); // Parse JSON from the request

    // Basic validation
    if (!title || !difficulty) {
      return new Response(
        JSON.stringify({ error: "Title and difficulty are required." }),
        { status: 400 }
      );
    }

    const newProblem = await prisma.problem.create({
      data: {
        title,
        difficulty,
        solved,
      },
    });

    return new Response(JSON.stringify(newProblem), { status: 201 });
  } catch (error) {
    console.error("Error creating problem:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create problem" }),
      { status: 500 }
    );
  }
}

// PUT function for updating problems
export async function PUT(req) {
    try {
      const { id, code } = await req.json();
      console.log("Received data:", { id, code });
  
      // Ensure ID is a number
      const problemId = Number(id);
      if (isNaN(problemId)) {
        return new Response(JSON.stringify({ error: "Invalid ID format" }), { status: 400 });
      }
  
      const updatedProblem = await prisma.problem.update({
        where: { id: problemId },
        data: { code },
      });
  
      return new Response(JSON.stringify(updatedProblem), { status: 200 });
    } catch (error) {
      console.error("Error updating problem:", error);
      return new Response(JSON.stringify({ error: "Failed to update problem" }), { status: 500 });
    }
  }

// DELETE function for deleting problems
export async function DELETE(req) {
    try {
      const { id } = await req.json();
  
      // Check if the id is null or undefined
      if (id === null || id === undefined) {
        return new Response(
          JSON.stringify({ error: "ID is required to delete a problem" }),
          { status: 400 } // Bad Request if id is null or undefined
        );
      }
  
      // Check if the problem exists in the database
      const problemToDelete = await prisma.problem.findUnique({
        where: { id },
      });
  
      if (!problemToDelete) {
        // If problem with the given id is not found
        return new Response(
          JSON.stringify({ error: "Problem not found" }),
          { status: 404 } // Not Found if the problem doesn't exist
        );
      }
  
      // Proceed to delete the problem if found
      const deletedProblem = await prisma.problem.delete({
        where: { id },
      });
  
      // Return success response
      return new Response(
        JSON.stringify({ message: "Problem deleted", problem: deletedProblem }),
        { status: 200 } // OK when the deletion is successful
      );
    } catch (error) {
      console.error("Error deleting problem:", error);
      return new Response(
        JSON.stringify({ error: "Failed to delete problem" }),
        { status: 500 } // Internal Server Error for unexpected errors
      );
    }
  }