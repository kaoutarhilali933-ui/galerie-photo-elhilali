<?php

namespace App\Controller\Admin;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class DeleteUserController extends AbstractController
{
    #[Route('/api/admin/users/{id}', name: 'admin_delete_user', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function __invoke(User $user, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($user);
        $em->flush();

        return $this->json([
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }
}