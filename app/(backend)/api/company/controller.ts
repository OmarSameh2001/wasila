import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../_lib/prisma";
import { filterPrisma } from "../../_lib/filtering";
import { handlePrismaError } from "../../_lib/errors";
import Cloudinary from "../../_lib/cloudinary";

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
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const logoFile = formData.get('logo') as File | null;

    let logoUrl = null;
    if (logoFile && logoFile instanceof File) {
      const uploadResult = await Cloudinary.upload(logoFile);
      logoUrl = uploadResult.secure_url;
      console.log(uploadResult || "Error uploading logo");
    }

    const company = await prisma.company.create({
      data: {
        name,
        address,
        logo: logoUrl,
      },
    });
    
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return handlePrismaError(error);
  }
}

export async function updateCompany(req: NextRequest, id: number) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string | null;
    const address = formData.get('address') as string | null;
    const logoFile = formData.get('logo') as File | null;

    // Build update data object
    const updateData: any = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;

    // Handle logo upload if new file provided
    if (logoFile && logoFile instanceof File) {
      // Optional: Delete old logo from Cloudinary first
      // const existingCompany = await prisma.company.findUnique({
      //   where: { id },
      //   select: { logo: true }
      // });
      
      // if (existingCompany?.logo) {
      //   // Extract public_id from URL if you want to delete old image
      //   // Example: https://res.cloudinary.com/cloud/image/upload/v123/public_id.jpg
      //   const urlParts = existingCompany.logo.split('/');
      //   const publicIdWithExt = urlParts[urlParts.length - 1];
      //   const publicId = publicIdWithExt.split('.')[0];
      //   await Cloudinary.deleteImage(publicId);
      // }

      const uploadResult = await Cloudinary.upload(logoFile);
      updateData.logo = uploadResult.secure_url;
      console.log(logoFile || "no logo");
      console.log(uploadResult || "Error uploading logo");
    }

    const company = await prisma.company.update({
      where: { id },
      data: updateData,
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
