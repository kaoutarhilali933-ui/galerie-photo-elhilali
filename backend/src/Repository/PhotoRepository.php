<?php

namespace App\Repository;

use App\Entity\Photo;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class PhotoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Photo::class);
    }

    public function findPublicPhotosByPseudo(string $pseudo): array
    {
        return $this->createQueryBuilder('p')
            ->join('p.user', 'u')
            ->andWhere('u.pseudo = :pseudo')
            ->andWhere('LOWER(p.visibility) = :visibility')
            ->andWhere('p.publicOrder IS NOT NULL') // ✅ FIX IMPORTANT
            ->setParameter('pseudo', $pseudo)
            ->setParameter('visibility', 'public')
            ->orderBy('p.publicOrder', 'ASC')
            ->addOrderBy('p.uploadedAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findPublicPseudos(): array
    {
        $results = $this->createQueryBuilder('p')
            ->select('DISTINCT u.pseudo AS pseudo')
            ->join('p.user', 'u')
            ->andWhere('LOWER(p.visibility) = :visibility')
            ->andWhere('p.publicOrder IS NOT NULL') // ✅ AJOUTÉ
            ->andWhere('u.pseudo IS NOT NULL')
            ->setParameter('visibility', 'public')
            ->orderBy('u.pseudo', 'ASC')
            ->getQuery()
            ->getArrayResult();

        return array_column($results, 'pseudo');
    }

    public function findPublicUsers(): array
    {
        $results = $this->createQueryBuilder('p')
            ->select('DISTINCT u.pseudo AS pseudo')
            ->join('p.user', 'u')
            ->andWhere('LOWER(p.visibility) = :visibility')
            ->andWhere('p.publicOrder IS NOT NULL') // ✅ AJOUTÉ
            ->andWhere('u.pseudo IS NOT NULL')
            ->setParameter('visibility', 'public')
            ->orderBy('u.pseudo', 'ASC')
            ->getQuery()
            ->getArrayResult();

        return array_map(fn ($row) => $row['pseudo'], $results);
    }

    public function isPublicOrderUsedByUser(User $user, int $publicOrder, ?int $excludePhotoId = null): bool
    {
        $qb = $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->andWhere('p.user = :user')
            ->andWhere('p.publicOrder = :publicOrder')
            ->setParameter('user', $user)
            ->setParameter('publicOrder', $publicOrder);

        if ($excludePhotoId !== null) {
            $qb->andWhere('p.id != :excludePhotoId')
               ->setParameter('excludePhotoId', $excludePhotoId);
        }

        return (int) $qb->getQuery()->getSingleScalarResult() > 0;
    }
}