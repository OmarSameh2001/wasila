import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { filterPrisma } from "../../_lib/filtering";
import { handlePrismaError } from "../../_lib/errors";

export async function getAllCompanies(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    return await filterPrisma(prisma.company, page, limit, {}, url, "company");
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Error fetching companies" },
      { status: 500 }
    );
  }
}

export async function getCompanyById(id: number) {
  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: { policies: true },
    });
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error("Error fetching company by id:", error);
    return NextResponse.json(
      { error: "Error fetching company by id" },
      { status: 500 }
    );
  }
}

export async function createCompany(req: NextRequest) {
  try {
    const { name, address, logo } = await req.json();
    const company = await prisma.company.create({
      data: {
        name,
        address,
        logo,
      },
    });
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function updateCompany(req: NextRequest, id: number) {
  try {
    const { id: _id, ...data } = await req.json();
    console.log(data);
    const company = await prisma.company.update({
      where: { id },
      data: { ...data },
    });
    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: "Error updating company" },
      { status: 500 }
    );
  }
}

export async function deleteCompany(id: number) {
  try {
    const company = await prisma.company.delete({
      where: { id },
    });
    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { error: `Error deleting company ${id}` },
      { status: 500 }
    );
  }
}

export async function searchCompany(req: NextRequest) {
  try {
    const url = new URL(req.url);
    return await filterPrisma(
      prisma.company,
      1,
      10,
      {},
      url,
      "company",
      {},
      { name: true, logo: true, id: true }
    );
  } catch (error) {}
}
