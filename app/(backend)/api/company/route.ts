import { NextRequest, NextResponse } from "next/server";
import {
  createCompany,
  deleteCompany,
  getAllCompanies,
  updateCompany,
} from "./controller";
import { authMiddleware } from "../../_middelware/auth";

export async function POST(req: NextRequest) {
  try {
    authMiddleware(req, "ADMIN");
    const company = await createCompany(req);
    return company;
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const companies = await getAllCompanies(req);
    return companies;
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    authMiddleware(req, "ADMIN");
    const company = await updateCompany(req);
    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    authMiddleware(req, "ADMIN");
    const company = await deleteCompany(req);
    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 401 }
    );
  }
}
