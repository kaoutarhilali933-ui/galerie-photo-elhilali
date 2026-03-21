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
            ->andWhere('p.publicOrder IS NOT NULL')
            ->setParameter('pseudo', $pseudo)
            ->orderBy('p.publicOrder', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findPublicPseudos(): array
    {
        $results = $this->createQueryBuilder('p')
            ->select('DISTINCT u.pseudo')
            ->join('p.user', 'u')
            ->andWhere('p.publicOrder IS NOT NULL')
            ->orderBy('u.pseudo', 'ASC')
            ->getQuery()
            ->getArrayResult();

        return array_column($results, 'pseudo');
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