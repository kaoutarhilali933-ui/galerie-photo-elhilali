<?php

namespace App\Controller\Admin;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class UnblockUserController extends AbstractController
{
    #[Route('/api/admin/users/{id}/unblock', name: 'admin_unblock_user', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function __invoke(User $user, EntityManagerInterface $em): JsonResponse
    {
        $user->setIsBlocked(false);
        $user->setFailedAttempts(0);

        $em->flush();

        return $this->json([
            'message' => 'Utilisateur débloqué avec succès'
        ]);
    }
}