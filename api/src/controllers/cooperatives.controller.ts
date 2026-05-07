import { MembershipGrade, MembershipRole, MembershipStatus } from "db/enums";
import type { Request, Response } from "express";
import { cloudinary, pinata } from "server";
import { encryptFile } from "services/crypto.service";
import { prisma } from "utils/prisma";

export async function createCooperative(req: Request, res: Response) {
  const { name, description, founders } = req.body;

  if (!req.files) {
    return res.status(400).json({ message: "Missing required files" });
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const logo = files?.logo[0];
  const statusDocument = files?.status_document[0];
  const proofDocument = files?.proof_document[0];
  const identityDocument = files?.identity_document[0];
  const businessPlanDocument = files?.business_plan_document[0];

  if (
    !name ||
    !description ||
    !logo ||
    !founders ||
    !statusDocument ||
    !proofDocument ||
    !identityDocument
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const encryptedStatusDocument = encryptFile(statusDocument);
  const encryptedProofDocument = encryptFile(proofDocument);
  const encryptedIdentityDocument = encryptFile(identityDocument);
  const encryptedBusinessPlanDocument = businessPlanDocument
    ? encryptFile(businessPlanDocument)
    : null;

  try {
    // Atomic upload
    const [
      statusDocumentUrl,
      proofDocumentUrl,
      identityDocumentUrl,
      businessPlanDocumentUrl,
    ] = await Promise.all([
      pinata.upload.public.file(
        new File(
          [encryptedStatusDocument.encryptedData],
          statusDocument.filename,
        ),
      ),
      pinata.upload.public.file(
        new File(
          [encryptedProofDocument.encryptedData],
          proofDocument.filename,
        ),
      ),
      pinata.upload.public.file(
        new File(
          [encryptedIdentityDocument.encryptedData],
          identityDocument.filename,
        ),
      ),
      encryptedBusinessPlanDocument
        ? pinata.upload.public.file(
            new File(
              [encryptedBusinessPlanDocument.encryptedData],
              businessPlanDocument.filename,
            ),
          )
        : null,
    ]);

    await prisma.$transaction(async (tx) => {
      const statusDocumentObject = await tx.encryptedDocument.create({
        data: {
          ipfsCid: statusDocumentUrl.cid,
          iv: encryptedStatusDocument.iv,
          tag: encryptedStatusDocument.tag,
        },
      });

      const proofDocumentObject = await tx.encryptedDocument.create({
        data: {
          ipfsCid: proofDocumentUrl.cid,
          iv: encryptedProofDocument.iv,
          tag: encryptedProofDocument.tag,
        },
      });

      const identityDocumentObject = await tx.encryptedDocument.create({
        data: {
          ipfsCid: identityDocumentUrl.cid,
          iv: encryptedIdentityDocument.iv,
          tag: encryptedIdentityDocument.tag,
        },
      });

      const businessPlanDocumentObject =
        businessPlanDocumentUrl && encryptedBusinessPlanDocument
          ? await prisma.encryptedDocument.create({
              data: {
                ipfsCid: businessPlanDocumentUrl.cid,
                iv: encryptedBusinessPlanDocument.iv,
                tag: encryptedBusinessPlanDocument.tag,
              },
            })
          : null;

      await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "cooperatives", public_id: logo.originalname },
            (error, result) => (error ? reject(error) : resolve(result)),
          )
          .end(logo.buffer);
      });

      const createdCooperative = await tx.cooperatives.create({
        data: {
          name: name as string,
          description: description as string,
          logo: logo.filename,
          founders: founders as string[],
          creatorId: req.session.user.id,
          statusDocumentIpfsCid: statusDocumentObject.ipfsCid,
          proofDocumentIpfsCid: proofDocumentObject.ipfsCid,
          identityDocumentIpfsCid: identityDocumentObject.ipfsCid,
          businessPlanDocumentIpfsCid: businessPlanDocumentObject?.ipfsCid,
        },
      });

      res.status(201).json(createdCooperative);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occured" });
  }

  return res.end();
}

export async function joinCooperative(req: Request, res: Response) {
  const { cooperativeId } = req.body;

  try {
    await prisma.$transaction(async (tx) => {
      const cooperative = await tx.cooperatives.findUnique({
        where: {
          id: cooperativeId,
        },
      });

      if (!cooperative) {
        return res.status(404).json({ message: "La coopérative n'existe pas" });
      }

      const createdMembership = await tx.memberships.create({
        data: {
          userId: req.session.user.id,
          cooperativeId: cooperative.id,
          status: MembershipStatus.PENDING,
          grade: MembershipGrade.MEMBER,
          role: MembershipRole.FARMER,
        },
      });

      res.status(201).json(createdMembership);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite" });
  }

  return res.end();
}

export async function approveCooperativeJoin(req: Request, res: Response) {
  const { cooperativeId, memberId, isApproved } = req.body;

  if (!cooperativeId || !memberId || !isApproved) {
    return res
      .status(400)
      .json({ message: "Les champs ne sont pas renseignés" });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const cooperative = await tx.cooperatives.findUnique({
        where: {
          id: cooperativeId,
        },
      });

      if (!cooperative) {
        return res.status(404).json({ message: "La coopérative n'existe pas" });
      }

      const membership = await tx.memberships.findUnique({
        where: {
          userId_cooperativeId: {
            userId: memberId,
            cooperativeId: cooperativeId,
          },
        },
        include: {
          cooperative: true,
        },
      });

      if (!membership) {
        return res
          .status(404)
          .json({ message: "Le membre n'est pas membre de cette coopérative" });
      }

      await tx.memberships.update({
        where: {
          userId_cooperativeId: {
            userId: memberId,
            cooperativeId: cooperativeId,
          },
        },
        data: {
          status: isApproved
            ? MembershipStatus.ACCEPTED
            : MembershipStatus.REJECTED,
        },
      });

      res.status(200).json();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite" });
  }

  return res.end();
}
