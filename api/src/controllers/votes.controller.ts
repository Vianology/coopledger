import { VoteStatus, type VoteType } from "db/enums";
import type { Request, Response } from "express";
import { prisma } from "utils/prisma";

export async function proposeVote(req: Request, res: Response) {
  const {
    subject,
    description,
    proposals,
    endDate,
    type,
    cooperativeId,
    amount,
    beneficiary,
    paymentDeadline,
  } = req.body;

  if (!subject || !proposals || !endDate || !type || !cooperativeId) {
    return res
      .status(400)
      .json({ message: "Les champs obligatoires ne sont pas renseignés" });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Vérifier que l'auteur est membre du bureau
      const membership = await tx.memberships.findUnique({
        where: {
          userId_cooperativeId: { userId: req.session.user.id, cooperativeId },
        },
      });

      if (
        !membership ||
        (membership.grade !== "ADMIN" && membership.grade !== "TREASURER")
      ) {
        return res
          .status(403)
          .json({ message: "Seul le bureau peut proposer un vote" });
      }

      // 2. Snapshot du nombre de votants éligibles (ACCEPTED)
      const voterCount = await tx.memberships.count({
        where: { cooperativeId, status: "ACCEPTED" },
      });

      const vote = await tx.votes.create({
        data: {
          subject: subject as string,
          description: description as string,
          proposals: proposals as string[],
          endDate: new Date(endDate),
          type: type as VoteType,
          cooperativeId,
          amount: amount ? Number(amount) : null,
          beneficiary: beneficiary as string,
          paymentDeadline: paymentDeadline ? new Date(paymentDeadline) : null,
          totalEligibleVoters: voterCount,
          creatorId: req.session.user.id,
        },
      });

      res.status(201).json(vote);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite" });
  }

  return res.end();
}

export async function castVote(req: Request, res: Response) {
  const { voteId, choiceIndex } = req.body;

  if (!voteId || choiceIndex === undefined) {
    return res.status(400).json({ message: "ID de vote ou choix manquant" });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const vote = await tx.votes.findUnique({
        where: { id: voteId },
        include: { _count: { select: { VoteCasts: true } } },
      });

      if (!vote || vote.status !== VoteStatus.OPEN) {
        return res.status(404).json({ message: "Le vote n'est pas ouvert" });
      }

      // Vérifier l'adhésion
      const membership = await tx.memberships.findUnique({
        where: {
          userId_cooperativeId: {
            userId: req.session.user.id,
            cooperativeId: vote.cooperativeId,
          },
        },
      });

      if (!membership || membership.status !== "ACCEPTED") {
        return res.status(403).json({
          message: "Vous n'êtes pas membre actif de cette coopérative",
        });
      }

      // Enregistrer le vote et mettre à jour l'activité
      const voteCast = await tx.voteCasts.create({
        data: {
          voteId: voteId,
          userId: req.session.user.id,
          // Note: choiceIndex pourrait être stocké dans un futur champ si besoin de plus de détail
        },
      });

      await tx.memberships.update({
        where: {
          userId_cooperativeId: {
            userId: req.session.user.id,
            cooperativeId: vote.cooperativeId,
          },
        },
        data: { lastActiveAt: new Date() },
      });

      // Clôture automatique si 100% de participation
      if (vote._count.VoteCasts + 1 >= vote.totalEligibleVoters) {
        await tx.votes.update({
          where: { id: voteId },
          data: { status: VoteStatus.APPROVED }, // Simplification pour le MVP: tout vote fini est approuvé
        });
      }

      res.status(201).json(voteCast);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur s'est produite" });
  }

  return res.end();
}
